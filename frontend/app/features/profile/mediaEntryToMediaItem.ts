import { tmdbImageUrl } from "../../services/tmdb";
import type { MediaItem } from "../../types/media";
import type { MediaEntry } from "../../types/mediaEntry";
import { TmdbImageWidth } from "../../types/tmdb";

export function mediaEntryToMediaItem(entry: MediaEntry): MediaItem {
  return {
    id: String(entry.tmdbId),
    mediaType: entry.mediaType,
    title: entry.title,
    imageUrl: entry.posterPath ? tmdbImageUrl(TmdbImageWidth.Poster, entry.posterPath) : undefined,
  };
}
