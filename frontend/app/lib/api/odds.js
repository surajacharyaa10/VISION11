import footballDataApi from "./footballDataApi";

export const getOdds = (fixture) =>
    footballDataApi("/odds", {
        fixture,
    });

export const getLiveOdds = (fixture) =>
    footballDataApi("/odds/live", {
        fixture,
    });
