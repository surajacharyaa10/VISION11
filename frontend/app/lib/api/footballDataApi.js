const BASE_URL = "https://v3.football.api-sports.io";

const API_KEY =
  process.env.NEXT_PUBLIC_FOOTBALL_API_KEY ||
  "80609236c3094b79b7d41dfdd61a86f3";

async function footballDataApi(endpoint, params = {}) {
  const url = new URL(BASE_URL + endpoint);

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      url.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

export default footballDataApi;