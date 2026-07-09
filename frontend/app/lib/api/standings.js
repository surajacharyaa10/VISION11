import footballDataApi from "./footballDataApi";

export const getStandings = (
    league,
    season
) =>
    footballDataApi("/standings", {
        league,
        season,
    });