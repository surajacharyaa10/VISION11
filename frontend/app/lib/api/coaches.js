import footballDataApi from "./footballDataApi";

export const getCoach = (id) =>
    footballDataApi("/coachs", {
        id,
    });

export const searchCoach = (name) =>
    footballDataApi("/coachs", {
        search: name,
    });