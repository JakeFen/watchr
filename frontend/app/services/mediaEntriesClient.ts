import type { WatchStatus } from "../types/media";
import type { MediaEntry } from "../types/mediaEntry";
import type { TmdbMediaType } from "../types/tmdb";

export async function createMediaEntry(input: {
  mediaType: TmdbMediaType;
  tmdbId: number;
  title: string;
  posterPath?: string;
  status: WatchStatus;
}): Promise<MediaEntry> {
  const response = await fetch("/api/media-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to create media entry");
  }
  return response.json();
}

export async function updateMediaEntryStatus(id: string, status: WatchStatus): Promise<MediaEntry> {
  const response = await fetch(`/api/media-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update media entry");
  }
  return response.json();
}

export async function deleteMediaEntry(id: string): Promise<void> {
  const response = await fetch(`/api/media-entries/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete media entry");
  }
}
