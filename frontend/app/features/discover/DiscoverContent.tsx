import {
  getNowPlayingMovies,
  getStreamingMovies,
  getStreamingShows,
  getTrendingMovies,
} from "../../services/tmdb";
import { PopularCategory } from "../../types/discover";
import { TmdbTimeWindow } from "../../types/tmdb";
import { DiscoverToggleRows } from "./DiscoverToggleRows";
import { SearchHero } from "./SearchHero";

export async function DiscoverContent() {
  const [trendingToday, trendingWeek, streamingMovies, inTheaters, streamingShows] =
    await Promise.all([
      getTrendingMovies(TmdbTimeWindow.Day),
      getTrendingMovies(TmdbTimeWindow.Week),
      getStreamingMovies(),
      getNowPlayingMovies(),
      getStreamingShows(),
    ]);

  return (
    <>
      <SearchHero />
      <DiscoverToggleRows
        trendingMoviesByWindow={{
          [TmdbTimeWindow.Day]: trendingToday,
          [TmdbTimeWindow.Week]: trendingWeek,
        }}
        popularMoviesByCategory={{
          [PopularCategory.Movies]: streamingMovies,
          [PopularCategory.InTheaters]: inTheaters,
          [PopularCategory.Shows]: streamingShows,
        }}
      />
    </>
  );
}
