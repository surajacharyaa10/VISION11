import { getNewsInfo } from "@/api";
import { newsType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const News = async () => {
  let newsData: newsType[] = [];

  try {
    const getNews = await getNewsInfo();

    // Check if articles exist before assigning
    if (getNews && Array.isArray(getNews.articles)) {
      newsData = getNews.articles;
    }
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }

  return (
    <div className="w-[350px] bg-[rgb(40,46,58)] rounded-md px-2 md:px-6 py-2">
      <h1 className="text-xl text-teal-400 font-bold mb-4">
        News - Top Headlines
      </h1>

      <div>
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <Link key={news.title} href={news.url || "#"} target="_blank">
              <div className="relative w-full h-[150px] mb-4 group cursor-pointer">
                <Image
                  src={
                    news?.urlToImage
                      ? news.urlToImage
                      : "/img/news-football.webp"
                  }
                  alt={news.title || "News Image"}
                  fill
                  className="object-cover rounded-md"
                />

                <div className="absolute bottom-0 left-0 w-full p-2 z-10 bg-gradient-to-t from-zinc-900 to-transparent">
                  <p className="font-semibold text-lg group-hover:text-teal-400">
                    {news.title}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400">No news available right now.</p>
        )}
      </div>
    </div>
  );
};

export default News;
