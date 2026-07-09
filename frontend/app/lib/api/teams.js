import footballDataApi from "./footballDataApi";

export const getTeams = (league, season) =>
    footballDataApi("/teams", {
        league,
        season,
    });

export const getTeam = (id) =>
    footballDataApi("/teams", {
        id,
    });

export const searchTeam = (name) =>
    footballDataApi("/teams", {
        search: name,
    });

export const getTeamStatistics = (
    league,
    season,
    team
) =>
    footballDataApi("/teams/statistics", {
        league,
        season,
        team,
    });