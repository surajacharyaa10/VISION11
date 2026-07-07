const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

const BASE_URL = "https://v3.football.api-sports.io";

export async function footballApi(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "x-apisports-key": API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch football data");
  }

  return res.json();
}