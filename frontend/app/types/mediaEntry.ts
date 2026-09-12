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
};
