import footballDataApi from "./footballDataApi";

export const getTimezone = () =>
    footballDataApi("/timezone");
