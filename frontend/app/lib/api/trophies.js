import footballDataApi from "./footballDataApi";

export const getTrophies = (player, coach) =>
    footballDataApi("/trophies", {
        player,
        coach,
    });
