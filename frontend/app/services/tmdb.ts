import { TmdbMediaType, TmdbTimeWindow, type TmdbMediaResult } from "../types/tmdb";
import type { MediaItem } from "../types/media";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

async function fetchMediaList(path: string): Promise<MediaItem[]> {
  const response = await fetch(`${TMDB_API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const { results }: { results: TmdbMediaResult[] } = await response.json();

  return results.slice(0, 10).map((result) => ({
    id: String(result.id),
    title: result.title ?? result.name ?? "Untitled",
    imageUrl: result.poster_path ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}` : undefined,
    rating: result.vote_average > 0 ? result.vote_average : undefined,
  }));
}

export function getTrendingMovies(timeWindow: TmdbTimeWindow = TmdbTimeWindow.Week) {
  return fetchMediaList(`/trending/${TmdbMediaType.Movie}/${timeWindow}`);
}

export function getTrendingShows(timeWindow: TmdbTimeWindow = TmdbTimeWindow.Week) {
  return fetchMediaList(`/trending/${TmdbMediaType.Tv}/${timeWindow}`);
}

function fetchStreaming(mediaType: TmdbMediaType) {
  return fetchMediaList(
    `/discover/${mediaType}?sort_by=popularity.desc&watch_region=US&with_watch_monetization_types=flatrate`,
  );
}

export function getStreamingMovies() {
  return fetchStreaming(TmdbMediaType.Movie);
}

export function getStreamingShows() {
  return fetchStreaming(TmdbMediaType.Tv);
}

export function getNowPlayingMovies() {
  return fetchMediaList(`/${TmdbMediaType.Movie}/now_playing`);
}
