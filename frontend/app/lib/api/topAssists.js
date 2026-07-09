import footballDataApi from "./footballDataApi";

export const getTopAssists = (
    league,
    season
) =>
    footballDataApi("/players/topassists", {
        league,
        season,
    });