"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import {
  createMediaEntry,
  deleteMediaEntry,
  updateMediaEntryStatus,
} from "../services/mediaEntriesClient";
import { WatchStatus } from "../types/media";
import type { MediaEntry } from "../types/mediaEntry";
import type { TmdbMediaType } from "../types/tmdb";

export function useMediaEntry({
  mediaType,
  tmdbId,
  title,
  posterPath,
  initialEntry,
  isSignedIn,
}: {
  mediaType: TmdbMediaType;
  tmdbId: number;
  title: string;
  posterPath?: string;
  initialEntry: MediaEntry | null;
  isSignedIn: boolean;
}) {
  const { openSignIn } = useClerk();
  const [entry, setEntry] = useState(initialEntry);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function requireSignIn(): boolean {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }
    return true;
  }

  async function setStatus(next: WatchStatus) {
    if (!requireSignIn()) return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = entry
        ? await updateMediaEntryStatus(entry.id, next)
        : await createMediaEntry({ mediaType, tmdbId, title, posterPath, status: next });
      setEntry(updated);
    } catch {
      setError("Couldn't save that -- try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // saveWatched marks the entry watched and sets rating/review in one
  // call -- used by the post-watched modal so clicking "Watched"
  // itself doesn't save anything until the user actually submits or
  // skips that modal.
  async function saveWatched(rating: number | null, review: string | null): Promise<boolean> {
    if (!requireSignIn()) return false;

    setIsSaving(true);
    setError(null);
    try {
      const updated = entry
        ? await updateMediaEntryStatus(entry.id, WatchStatus.Watched, { rating, review })
        : await createMediaEntry({ mediaType, tmdbId, title, posterPath, status: WatchStatus.Watched, rating, review });
      setEntry(updated);
      return true;
    } catch {
      setError("Couldn't save that -- try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function remove() {
    if (!entry || !requireSignIn()) return;

    setIsSaving(true);
    setError(null);
    try {
      await deleteMediaEntry(entry.id);
      setEntry(null);
    } catch {
      setError("Couldn't remove that -- try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    status: entry?.status ?? null,
    isSaving,
    error,
    setStatus,
    saveWatched,
    remove,
  };
}
