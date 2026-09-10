"use client";

import { useState } from "react";
import { MediaRow } from "../../components/MediaRow";
import { PopularCategory } from "../../types/discover";
import type { MediaItem } from "../../types/media";
import { TmdbTimeWindow } from "../../types/tmdb";

export function DiscoverToggleRows({
  trendingMoviesByWindow,
  popularMoviesByCategory,
}: {
  trendingMoviesByWindow: Record<TmdbTimeWindow, MediaItem[]>;
  popularMoviesByCategory: Record<PopularCategory, MediaItem[]>;
}) {
  const [trendingWindow, setTrendingWindow] = useState<TmdbTimeWindow>(
    TmdbTimeWindow.Day
  );
  const [popularCategory, setPopularCategory] = useState<PopularCategory>(
    PopularCategory.Movies
  );

  return (
    <>
      <MediaRow
        title="Trending Movies"
        items={trendingMoviesByWindow[trendingWindow]}
        chips={{
          value: trendingWindow,
          onChange: setTrendingWindow,
          options: [
            { label: "Today", value: TmdbTimeWindow.Day },
            { label: "This Week", value: TmdbTimeWindow.Week },
          ],
        }}
      />

      <MediaRow
        title="Popular Now"
        items={popularMoviesByCategory[popularCategory]}
        chips={{
          value: popularCategory,
          onChange: setPopularCategory,
          options: [
            { label: "Streaming Movies", value: PopularCategory.Movies },
            { label: "Streaming Shows", value: PopularCategory.Shows },
            { label: "In Theaters", value: PopularCategory.InTheaters },
          ],
        }}
      />
    </>
  );
}
