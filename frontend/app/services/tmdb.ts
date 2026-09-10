import type { MediaItem } from "../components/MediaCard";
import type { TmdbMediaType, TmdbTrendingResult } from "../types/tmdb";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

async function fetchTrending(mediaType: TmdbMediaType): Promise<MediaItem[]> {
  const response = await fetch(`${TMDB_API_BASE_URL}/trending/${mediaType}/week`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending ${mediaType}: ${response.status}`);
  }

  const { results }: { results: TmdbTrendingResult[] } = await response.json();

  return results.slice(0, 10).map((result) => ({
    id: String(result.id),
    title: result.title ?? result.name ?? "Untitled",
    imageUrl: result.poster_path ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}` : undefined,
  }));
}

export function getTrendingMovies() {
  return fetchTrending("movie");
}

export function getTrendingShows() {
  return fetchTrending("tv");
}
