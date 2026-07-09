import footballDataApi from "./footballDataApi";

export const getTopScorers = (
    league,
    season
) =>
    footballDataApi("/players/topscorers", {
        league,
        season,
    });