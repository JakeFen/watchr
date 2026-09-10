import { Show } from "@clerk/nextjs";
import { TrendingRow } from "../../components/TrendingRow";
import { getTrendingMovies, getTrendingShows } from "../../services/tmdb";
import { Hero } from "./Hero";

export async function LandingContent() {
  const [trendingMovies, trendingShows] = await Promise.all([
    getTrendingMovies(),
    getTrendingShows(),
  ]);

  return (
    <>
      <Show when="signed-out">
        <Hero />
        <TrendingRow title="Trending Movies" items={trendingMovies} />
        <TrendingRow title="Trending Shows" items={trendingShows} />
      </Show>
      <Show when="signed-in">
        <p>Signed In</p>
      </Show>
    </>
  );
}
