import footballDataApi from "./footballDataApi";

export const getVenue = (id) =>
    footballDataApi("/venues", {
        id,
    });

export const searchVenue = (search) =>
    footballDataApi("/venues", {
        search,
    });