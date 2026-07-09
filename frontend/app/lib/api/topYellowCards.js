import footballDataApi from "./footballDataApi";

export const getTopYellowCards = (league, season) =>
    footballDataApi("/players/topyellowcards", {
        league,
        season,
    });
