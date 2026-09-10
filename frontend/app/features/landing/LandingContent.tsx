import { Show } from "@clerk/nextjs";
import { MediaRow } from "../../components/MediaRow";
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
        <MediaRow title="Trending Movies" items={trendingMovies} />
        <MediaRow title="Trending Shows" items={trendingShows} />
      </Show>
      <Show when="signed-in">
        <p>Signed In</p>
      </Show>
    </>
  );
}
