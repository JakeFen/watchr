import type { TmdbMediaType } from "./tmdb";

export enum WatchStatus {
  WantToWatch = "want_to_watch",
  Watching = "watching",
  Watched = "watched",
}

export type MediaItem = {
  id: string;
  mediaType: TmdbMediaType;
  title: string;
  imageUrl?: string;
  rating?: number;
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
