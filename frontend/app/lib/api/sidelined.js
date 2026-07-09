import footballDataApi from "./footballDataApi";

export const getSidelined = (player, coach) =>
    footballDataApi("/sidelined", {
        player,
        coach,
    });
