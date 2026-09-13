import type { WatchStatus } from "../types/media";
import type { MediaEntry } from "../types/mediaEntry";
import type { TmdbMediaType } from "../types/tmdb";

const BACKEND_URL = process.env.BACKEND_URL;

type MediaEntryResponse = {
  id: string;
  media_type: TmdbMediaType;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
};

function toMediaEntry(entry: MediaEntryResponse): MediaEntry {
  return {
    id: entry.id,
    mediaType: entry.media_type,
    tmdbId: entry.tmdb_id,
    title: entry.title,
    posterPath: entry.poster_path,
    status: entry.status,
    rating: entry.rating,
    review: entry.review,
  };
}

function backendFetch(token: string, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export async function getMyMediaEntry(
  token: string,
  mediaType: TmdbMediaType,
  tmdbId: number,
): Promise<MediaEntry | null> {
  const response = await backendFetch(token, `/media-entries/tmdb/${mediaType}/${tmdbId}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch media entry: ${response.status}`);
  }
  return toMediaEntry(await response.json());
}

// listMediaEntriesForUser lists a user's entries by their internal
// users.id. Media entries aren't private, so this hits the backend's
// public endpoint directly -- no Clerk token needed, and it works the
// same whether userID is the caller's own id or someone else's.
export async function listMediaEntriesForUser(userID: string): Promise<MediaEntry[]> {
  const response = await fetch(`${BACKEND_URL}/users/${userID}/media-entries`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to list media entries: ${response.status}`);
  }
  const entries: MediaEntryResponse[] = await response.json();
  return entries.map(toMediaEntry);
}

export async function createMediaEntry(
  token: string,
  input: {
    mediaType: TmdbMediaType;
    tmdbId: number;
    title: string;
    posterPath?: string;
    status: WatchStatus;
  },
): Promise<MediaEntry> {
  const response = await backendFetch(token, "/media-entries", {
    method: "POST",
    body: JSON.stringify({
      media_type: input.mediaType,
      tmdb_id: input.tmdbId,
      title: input.title,
      poster_path: input.posterPath ?? null,
      status: input.status,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create media entry: ${response.status}`);
  }
  return toMediaEntry(await response.json());
}

export async function updateMediaEntryStatus(
  token: string,
  id: string,
  status: WatchStatus,
): Promise<MediaEntry> {
  const response = await backendFetch(token, `/media-entries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update media entry: ${response.status}`);
  }
  return toMediaEntry(await response.json());
}

export async function deleteMediaEntry(token: string, id: string): Promise<void> {
  const response = await backendFetch(token, `/media-entries/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete media entry: ${response.status}`);
  }
}
