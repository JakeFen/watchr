import type { MediaItem } from "../../components/MediaCard";

export const trendingMovies: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `movie-${i + 1}`,
  title: `Trending Movie ${i + 1}`,
}));

export const trendingShows: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `show-${i + 1}`,
  title: `Trending Show ${i + 1}`,
}));
