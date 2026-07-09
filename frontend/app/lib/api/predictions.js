import footballDataApi from "./footballDataApi";

export const getPrediction = (fixture) =>
    footballDataApi("/predictions", {
        fixture,
    });