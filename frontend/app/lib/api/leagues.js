import footballDataApi from "./footballDataApi";

export const getLeagues = (season = 2025) =>
    footballDataApi("/leagues", {
        season,
    });

export const getLeague = (id, season) =>
    footballDataApi("/leagues", {
        id,
        season,
    });

export const searchLeague = (search) =>
    footballDataApi("/leagues", {
        search,
    });