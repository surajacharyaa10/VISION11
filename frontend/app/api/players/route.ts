import { NextResponse } from "next/server";

const BZZOIRO_BASE = "https://sports.bzzoiro.com/api/v2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || "0";
  const limit = searchParams.get("limit") || "100";
  const search = searchParams.get("search") || "";
  const position = searchParams.get("position") || "";
  
  const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY || "";
  
  let url = `${BZZOIRO_BASE}/players/?limit=${limit}&offset=${offset}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (position) {
    url += `&position=${encodeURIComponent(position)}`;
  }
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Bzzoiro" }, { status: res.status });
    }
    const data = await res.json();
    
    // Map data just like in Players/page.tsx
    const raw = data.results ?? (Array.isArray(data) ? data : []);
    const totalCount = data.count ?? raw.length;
    
    const players = raw.map((p: any) => ({
      id: p.id,
      name: p.name,
      team: p.nationality || p.team_name || "Unknown",
      role: positionLabel(p.position),
      position: p.position || "",
      img: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=e0f2fe&color=0369a1&size=200`,
    }));
    
    return NextResponse.json({ players, totalCount });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function positionLabel(pos: string): string {
  if (pos === "F") return "Attacker";
  if (pos === "M") return "Midfielder";
  if (pos === "D") return "Defender";
  if (pos === "G") return "Goalkeeper";
  return "Player";
}
