import footballDataApi from "./footballDataApi";

export const getPlayers = (
    league,
    season,
    page = 1
) =>
    footballDataApi("/players", {
        league,
        season,
        page,
    });

export const searchPlayer = (
    search,
    season
) =>
    footballDataApi("/players", {
        search,
        season,
    });

export const getPlayerProfile = (id) =>
    footballDataApi("/players/profiles", {
        player: id,
    });