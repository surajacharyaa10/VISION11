import footballDataApi from "./footballDataApi";

export const getSquads = (team) =>
    footballDataApi("/players/squads", {
        team,
    });
