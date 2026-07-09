import footballDataApi from "./footballDataApi"

export const getFixtures = (league, season) =>
    footballDataApi("/fixtures", {
        league,
        season,
    });

export const getLiveFixtures = () =>
    footballDataApi("/fixtures", {
        live: "all",
    });

export const getFixtureById = (id) =>
    footballDataApi("/fixtures", {
        id,
    });

export const getFixturesByDate = (date) =>
    footballDataApi("/fixtures", {
        date,
    });