import footballDataApi from "./footballDataApi";

export const getTransfers = (player, team) =>
    footballDataApi("/transfers", {
        player,
        team,
    });
