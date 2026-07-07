const API_KEY =
  process.env.NEXT_PUBLIC_FOOTBALL_API_KEY ||
  process.env.FOOTBALL_API_KEY ||
  process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY ||
  process.env.FOOTBALL_DATA_API_KEY;

const BASE_URL = "https://api.football-data.org/v4";

export async function footballDataApi(endpoint) {
  const headers = {};

  if (API_KEY) {
    headers["X-Auth-Token"] = API_KEY;
  } else {
    console.warn(
      "No football API key found. Set NEXT_PUBLIC_FOOTBALL_API_KEY in your .env.local file."
    );
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `football-data.org API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
