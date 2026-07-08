const BZZOIRO_BASE = "https://sports.bzzoiro.com/api/v2";

function getApiKey() {
  return process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY || "";
}

/** Sleep for `ms` milliseconds */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch a URL with automatic retry on 429 (rate limit).
 * Reads the Retry-After header if present, otherwise uses exponential backoff.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, options);

    if (res.status !== 429 || attempt >= maxRetries) {
      return res;
    }

    // Respect Retry-After if the API sends it (in seconds)
    const retryAfter = res.headers.get("Retry-After");
    const waitMs = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : Math.min(1500 * 2 ** attempt, 60_000); // 1.5s → 3s → 6s → 12s → capped at 60s

    console.warn(
      `[bzzoiro] Rate limited (429). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})…`
    );
    await sleep(waitMs);
    attempt++;
  }
}

const fetchOpts = (apiKey: string): RequestInit => ({
  headers: { Authorization: `Token ${apiKey}` },
  ...(process.env.NODE_ENV === "development"
    ? { cache: "no-store" as RequestCache }
    : ({ next: { revalidate: 3600 } } as any)),
});

/** Fetch a single page of players */
export async function getBzzoiroPlayers(limit = 8) {
  const apiKey = getApiKey();
  if (!apiKey) { console.warn("Bzzoiro API key not found"); return []; }

  try {
    const res = await fetchWithRetry(
      `${BZZOIRO_BASE}/players/?limit=${limit}`,
      fetchOpts(apiKey)
    );
    if (!res.ok) { console.error("Bzzoiro API error:", res.status); return []; }
    const data = await res.json();
    return data.results || data || [];
  } catch (e) {
    console.error("Bzzoiro fetch failed:", e);
    return [];
  }
}

/**
 * Fetches EVERY player in the database by paginating through all pages.
 *
 * Strategy:
 *  1. Fetch the first page → read `count` to know the total (e.g. 45,000).
 *  2. Build all page URLs up-front and fetch them in sequential batches
 *     with a polite delay between pages to respect rate limits.
 *  3. Deduplicate by ID at the end (handles unstable server-side cursors).
 *
 * No artificial cap — it will fetch as many records as the API reports.
 */
export async function getAllBzzoiroPlayers(): Promise<any[]> {
  const apiKey = getApiKey();
  if (!apiKey) { console.warn("Bzzoiro API key not found"); return []; }

  const PAGE_SIZE = 100;
  // Polite delay between pages to avoid triggering the rate limiter
  const PAGE_DELAY_MS = 700;

  // ── Step 1: Fetch page 0 and discover the total count ──────────────────────
  const firstUrl = `${BZZOIRO_BASE}/players/?limit=${PAGE_SIZE}&offset=0`;
  let firstData: any;
  try {
    const res = await fetchWithRetry(firstUrl, fetchOpts(apiKey));
    if (!res.ok) {
      console.error(`[bzzoiro] First page failed: HTTP ${res.status}`);
      return [];
    }
    firstData = await res.json();
  } catch (e) {
    console.error("[bzzoiro] First page fetch exception:", e);
    return [];
  }

  const firstPage: any[] = firstData.results ?? (Array.isArray(firstData) ? firstData : []);
  const totalCount: number = firstData.count ?? firstPage.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  console.log(`[bzzoiro] API reports ${totalCount} total players across ${totalPages} pages.`);

  const allPlayers: any[] = [...firstPage];

  // ── Step 2: Fetch remaining pages sequentially with delay ──────────────────
  for (let page = 1; page < totalPages; page++) {
    const offset = page * PAGE_SIZE;
    const url = `${BZZOIRO_BASE}/players/?limit=${PAGE_SIZE}&offset=${offset}`;

    await sleep(PAGE_DELAY_MS);

    try {
      const res = await fetchWithRetry(url, fetchOpts(apiKey));
      if (!res.ok) {
        console.error(`[bzzoiro] Page ${page} (offset ${offset}) failed: HTTP ${res.status} — stopping early.`);
        break;
      }
      const data = await res.json();
      const pageResults: any[] = data.results ?? (Array.isArray(data) ? data : []);
      allPlayers.push(...pageResults);

      console.log(
        `[bzzoiro] Page ${page}/${totalPages - 1} → +${pageResults.length} players (running total: ${allPlayers.length})`
      );

      // If the API says there's no next page, trust it
      if (data.next === null && page < totalPages - 1) {
        console.log("[bzzoiro] API signalled no next page — stopping early.");
        break;
      }
    } catch (e) {
      console.error(`[bzzoiro] Page ${page} exception:`, e);
      break;
    }
  }

  // ── Step 3: Deduplicate by ID ──────────────────────────────────────────────
  const seen = new Map<number, any>();
  for (const p of allPlayers) {
    if (p?.id != null && !seen.has(p.id)) seen.set(p.id, p);
  }
  const unique = Array.from(seen.values());
  console.log(`[bzzoiro] ✓ Done — ${unique.length} unique players (${allPlayers.length - unique.length} duplicates removed).`);

  return unique;
}

/**
 * Fetch career stats for a batch of player IDs concurrently,
 * with a configurable concurrency limit to avoid overwhelming the API.
 * Retries each request on 429.
 */
export async function getBatchCareerStats(
  playerIds: number[],
  concurrency = 10
): Promise<Map<number, { goals: number; assists: number; matches: number }>> {
  const apiKey = getApiKey();
  const results = new Map<number, { goals: number; assists: number; matches: number }>();

  async function fetchOne(id: number) {
    try {
      const res = await fetchWithRetry(
        `${BZZOIRO_BASE}/players/${id}/career/`,
        fetchOpts(apiKey)
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.seasons)) {
        const goals   = data.seasons.reduce((s: number, s2: any) => s + (s2.goals   || 0), 0);
        const assists = data.seasons.reduce((s: number, s2: any) => s + (s2.assists || 0), 0);
        const matches = data.seasons.reduce((s: number, s2: any) => s + (s2.matches || 0), 0);
        results.set(id, { goals, assists, matches });
      }
    } catch {
      // silently skip — career data is supplementary
    }
  }

  for (let i = 0; i < playerIds.length; i += concurrency) {
    const batch = playerIds.slice(i, i + concurrency);
    await Promise.allSettled(batch.map(fetchOne));
    if (i + concurrency < playerIds.length) {
      await sleep(300); // brief pause between career-stat batches
    }
  }

  return results;
}
