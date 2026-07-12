"use client";

import React, { useState } from "react";
import { matchesType } from "@/types";
import LeagueTable from "./LeagueTable";

interface Props {
  matchesList?: matchesType[];
  matchesListFinished?: matchesType[];
}

const Status: React.FC<Props> = ({
  matchesList = [],
  matchesListFinished = [],
}) => {
  const [statusMatch, setStatusMatch] = useState<string>("TODAY");

  const todayMatches = [...matchesList, ...matchesListFinished].filter(
    (data) =>
      data.status === "TIMED" ||
      data.status === "SCHEDULED" ||
      data.status === "IN_PLAY" ||
      data.status === "PAUSED",
  );

  const finishedMatches = [...matchesList, ...matchesListFinished].filter(
    (data) => data.status === "FINISHED",
  );

  return (
    <div>
      <div className="flex space-x-4 mb-2 md:mb-4">
        <button
          className={`px-2 py-1 text-primary text-xs md:text-sm rounded-md ${
            statusMatch === "TODAY"
              ? "bg-teal-400 font-semibold"
              : "bg-slate-500 font-normal"
          }`}
          onClick={() => setStatusMatch("TODAY")}
        >
          Today
        </button>

        <button
          className={`px-2 py-1 text-primary text-xs md:text-sm rounded-md ${
            statusMatch === "FINISHED"
              ? "bg-teal-400 font-semibold"
              : "bg-slate-500 font-normal"
          }`}
          onClick={() => setStatusMatch("FINISHED")}
        >
          Finished
        </button>
      </div>

      <div className="w-full">
        {statusMatch === "TODAY" &&
          (todayMatches.length > 0 ? (
            todayMatches.map((data) => (
              <div key={data.id}>
                <LeagueTable data={data} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No matches today.</p>
          ))}

        {statusMatch === "FINISHED" &&
          (finishedMatches.length > 0 ? (
            finishedMatches.map((data) => (
              <div key={data.id}>
                <LeagueTable data={data} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No finished matches.</p>
          ))}
      </div>
    </div>
  );
};

export default Status;
