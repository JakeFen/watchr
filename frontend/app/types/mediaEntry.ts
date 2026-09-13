import type { WatchStatus } from "./media";
import type { TmdbMediaType } from "./tmdb";

export type MediaEntry = {
  id: string;
  mediaType: TmdbMediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  updatedAt: string;
};

export type MediaEntryResponse = {
  id: string;
  media_type: TmdbMediaType;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  updated_at: string;
};
