import { footballApi } from "./footballApi";

export async function getDomesticCompetitions() {
  const data = await footballApi("/leagues?current=true");

  return data.response.filter(item => {
    const type = item.league.type;

    return (
      type === "League" ||
      type === "Cup"
    );
  });
}