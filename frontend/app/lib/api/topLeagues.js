import { footballApi } from "./footballApi";

export async function getTopLeagues() {
  const leagues = [
    39,   // Premier League
    140,  // La Liga
    135,  // Serie A
    78,   // Bundesliga
    61,   // Ligue 1
  ];

  const requests = leagues.map(id =>
    footballApi(`/leagues?id=${id}&current=true`)
  );

  const data = await Promise.all(requests);

  return data.flatMap(item => item.response);
}