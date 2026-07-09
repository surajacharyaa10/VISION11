import footballDataApi from "./footballDataApi";

export const getCountries = () =>
    footballDataApi("/countries");

export const searchCountry = (name) =>
    footballDataApi("/countries", {
        search: name,
    });