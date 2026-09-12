import {
  TmdbImageWidth,
  TmdbMediaType,
  TmdbTimeWindow,
  type TmdbMediaDetailsResponse,
  type TmdbMediaResult,
} from "../types/tmdb";
import type { MediaDetails, MediaItem } from "../types/media";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const WATCH_REGION = "US";

function tmdbImageUrl(width: TmdbImageWidth, path: string): string {
  return `${TMDB_IMAGE_BASE_URL}/${width}${path}`;
}

async function tmdbFetch<T>(path: string): Promise<T> {
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

  return response.json();
}

function toMediaItem(result: TmdbMediaResult, mediaType: TmdbMediaType): MediaItem {
  return {
    id: String(result.id),
    mediaType,
    title: result.title ?? result.name ?? "Untitled",
    imageUrl: result.poster_path
      ? tmdbImageUrl(TmdbImageWidth.Poster, result.poster_path)
      : undefined,
    rating: result.vote_average > 0 ? result.vote_average : undefined,
  };
}

async function fetchMediaList(path: string, mediaType: TmdbMediaType): Promise<MediaItem[]> {
  const { results } = await tmdbFetch<{ results: TmdbMediaResult[] }>(path);
  return results.slice(0, 10).map((result) => toMediaItem(result, mediaType));
}

export function getTrendingMovies(timeWindow: TmdbTimeWindow = TmdbTimeWindow.Week) {
  return fetchMediaList(`/trending/${TmdbMediaType.Movie}/${timeWindow}`, TmdbMediaType.Movie);
}

export function getTrendingShows(timeWindow: TmdbTimeWindow = TmdbTimeWindow.Week) {
  return fetchMediaList(`/trending/${TmdbMediaType.Tv}/${timeWindow}`, TmdbMediaType.Tv);
}

function fetchStreaming(mediaType: TmdbMediaType) {
  return fetchMediaList(
    `/discover/${mediaType}?sort_by=popularity.desc&watch_region=${WATCH_REGION}&with_watch_monetization_types=flatrate`,
    mediaType,
  );
}

export function getStreamingMovies() {
  return fetchStreaming(TmdbMediaType.Movie);
}

export function getStreamingShows() {
  return fetchStreaming(TmdbMediaType.Tv);
}

export function getNowPlayingMovies() {
  return fetchMediaList(`/${TmdbMediaType.Movie}/now_playing`, TmdbMediaType.Movie);
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

export async function getMediaDetails(
  id: string,
  mediaType: TmdbMediaType,
): Promise<MediaDetails> {
  const details = await tmdbFetch<TmdbMediaDetailsResponse>(
    `/${mediaType}/${id}?append_to_response=credits,videos,watch/providers,similar`,
  );

  const runtimeLabel =
    mediaType === TmdbMediaType.Movie
      ? details.runtime
        ? formatRuntime(details.runtime)
        : undefined
      : [
          details.number_of_seasons
            ? `${details.number_of_seasons} season${details.number_of_seasons === 1 ? "" : "s"}`
            : undefined,
          details.number_of_episodes
            ? `${details.number_of_episodes} episodes`
            : undefined,
        ]
          .filter(Boolean)
          .join(" · ") || undefined;

  const trailer = details.videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  return {
    id: String(details.id),
    mediaType,
    title: details.title ?? details.name ?? "Untitled",
    tagline: details.tagline || undefined,
    overview: details.overview,
    posterUrl: details.poster_path
      ? tmdbImageUrl(TmdbImageWidth.Poster, details.poster_path)
      : undefined,
    backdropUrl: details.backdrop_path
      ? tmdbImageUrl(TmdbImageWidth.Backdrop, details.backdrop_path)
      : undefined,
    releaseDate: details.release_date || details.first_air_date || undefined,
    runtimeLabel,
    genres: details.genres.map((genre) => genre.name),
    rating: details.vote_average > 0 ? details.vote_average : undefined,
    voteCount: details.vote_count,
    status: details.status,
    imdbUrl: details.imdb_id ? `https://www.imdb.com/title/${details.imdb_id}` : undefined,
    budget: details.budget || undefined,
    revenue: details.revenue || undefined,
    productionCompanies: details.production_companies?.map((company) => company.name) ?? [],
    directors: details.credits.crew
      .filter((member) => member.job === "Director")
      .map((member) => member.name),
    cast: details.credits.cast.map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      imageUrl: member.profile_path
        ? tmdbImageUrl(TmdbImageWidth.Profile, member.profile_path)
        : undefined,
    })),
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined,
    watchProviders: (details["watch/providers"].results[WATCH_REGION]?.flatrate ?? []).map(
      (provider) => ({
        name: provider.provider_name,
        logoUrl: tmdbImageUrl(TmdbImageWidth.Poster, provider.logo_path),
      }),
    ),
    similar: details.similar.results.slice(0, 10).map((result) => toMediaItem(result, mediaType)),
  };
}
