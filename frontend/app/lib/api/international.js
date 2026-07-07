import { footballApi } from "./footballApi";

export async function getInternationalCompetitions() {
  const leagues = [
    2,    // UEFA Champions League
    3,    // UEFA Europa League
    848,  // UEFA Conference League

    531,  // UEFA Super Cup

    15,   // FIFA Club World Cup
    1,    // FIFA World Cup
    32,   // World Cup Qualification

    5,    // UEFA Nations League
    4,    // Euro Championship
    960,  // Euro Qualification

    9,    // Copa America
    11,   // Copa America Qualification

    6,    // Gold Cup

    7,    // AFC Asian Cup
    17,   // AFC Asian Cup Qualification

    18,   // AFC Champions League Elite
    19,   // AFC Champions League Two

    12,   // CAF Champions League
    20,   // CAF Confederation Cup

    21,   // OFC Champions League

    10,   // International Friendlies
  ];

  const requests = leagues.map(id =>
    footballApi(`/leagues?id=${id}&current=true`)
  );

  const data = await Promise.all(requests);

  return data.flatMap(item => item.response);
}