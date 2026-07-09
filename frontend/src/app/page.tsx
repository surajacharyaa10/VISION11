import { getMatchesFootballFinished, getMatchesFootball } from "@/api"
import Status from "./components/Status"

export default async function Home() {
  const getData = await getMatchesFootball()
  const getDataFinished = await getMatchesFootballFinished()

  const matchesData = getData?.matches
  const matchesDataFinished = getDataFinished?.matches


  const nd = new Date()
  const dateConvert = nd.toDateString()

  return (
    <section className="px-2 md:px-4 md:w-[600px]">
      <div className="flex justify-between items-center mb-4 md:mb-2">
        <h1 className="text-md md:text-xl font-bold">
          MATCHES
        </h1>
        <div className="px-4 py-0 md:py-1 bg-slate-600
        rounded-md text-textPrimary text-sm">
          <p>{dateConvert}</p>
        </div>
      </div>
      <Status matchesList={matchesData} matchesListFinished={matchesDataFinished}/>
    </section>
  );
}
