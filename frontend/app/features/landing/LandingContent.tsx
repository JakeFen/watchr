import { Show } from "@clerk/nextjs";
import { TrendingRow } from "../../components/TrendingRow";
import { trendingMovies, trendingShows } from "./data";
import { Hero } from "./Hero";

export function LandingContent() {
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
