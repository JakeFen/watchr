"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import {
  createMediaEntry,
  deleteMediaEntry,
  updateMediaEntryStatus,
} from "../services/mediaEntriesClient";
import type { WatchStatus } from "../types/media";
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
    remove,
  };
}
