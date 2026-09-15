import type { WatchStatus } from "./media";
import type { TmdbMediaType } from "./tmdb";

export type MediaEntry = {
  id: string;
  userId: string;
  mediaType: TmdbMediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  updatedAt: string;
  likeCount: number;
};

export type MediaEntryResponse = {
  id: string;
  user_id: string;
  media_type: TmdbMediaType;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  updated_at: string;
  like_count: number;
};

// FeedEntry adds whether the feed's viewer has liked the entry --
// only meaningful in a viewer-scoped listing like the feed, not on a
// MediaEntry looked up on its own with no authenticated viewer to
// check against.
export type FeedEntry = MediaEntry & { likedByMe: boolean };

export type FeedEntryResponse = MediaEntryResponse & { liked_by_me: boolean };
