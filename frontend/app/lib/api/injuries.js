import footballDataApi from "./footballDataApi";

export const getInjuries = (
    league,
    season
) =>
    footballDataApi("/injuries", {
        league,
        season,
    });