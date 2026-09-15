import type { TmdbMediaType } from "./tmdb";

export enum WatchStatus {
  WantToWatch = "want_to_watch",
  Watching = "watching",
  Watched = "watched",
}

export const WATCH_STATUS_LABEL: Record<WatchStatus, string> = {
  [WatchStatus.Watched]: "Watched",
  [WatchStatus.Watching]: "Watching",
  [WatchStatus.WantToWatch]: "Want to Watch",
};

export type MediaItem = {
  id: string;
  mediaType: TmdbMediaType;
  title: string;
  imageUrl?: string;
  rating?: number;
  overview?: string;
};

export type MediaCastMember = {
  id: number;
  name: string;
  character: string;
  imageUrl?: string;
};

export type MediaWatchProvider = {
  name: string;
  logoUrl: string;
};

export type MediaDetails = {
  id: string;
  mediaType: TmdbMediaType;
  title: string;
  tagline?: string;
  overview: string;
  posterPath?: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  runtimeLabel?: string;
  genres: string[];
  rating?: number;
  voteCount: number;
  status: string;
  imdbUrl?: string;
  budget?: number;
  revenue?: number;
  productionCompanies: string[];
  directors: string[];
  cast: MediaCastMember[];
  trailerUrl?: string;
  watchProviders: MediaWatchProvider[];
  similar: MediaItem[];
};
