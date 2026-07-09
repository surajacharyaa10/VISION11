import footballDataApi from "./footballDataApi";

export const getTopRedCards = (league, season) =>
    footballDataApi("/players/topredcards", {
        league,
        season,
    });
