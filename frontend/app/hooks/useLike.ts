"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { likeMediaEntry, unlikeMediaEntry } from "../services/mediaEntriesClient";

export function useLike({
  mediaEntryId,
  initialLiked,
  initialCount,
}: {
  mediaEntryId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const { openSignIn } = useClerk();
  // Read live client-side auth state rather than trusting a signed-in
  // flag baked into the server-rendered page -- if that render is
  // served from the Router Cache after the user signs in elsewhere,
  // a stale "signed out" snapshot would wrongly call openSignIn()
  // while a real session is already active.
  const { isSignedIn } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function requireSignIn(): boolean {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }
    return true;
  }

  async function toggle() {
    if (!requireSignIn()) return;

    setIsSaving(true);
    setError(null);
    try {
      if (liked) {
        await unlikeMediaEntry(mediaEntryId);
        setLiked(false);
        setCount((count) => count - 1);
      } else {
        await likeMediaEntry(mediaEntryId);
        setLiked(true);
        setCount((count) => count + 1);
      }
    } catch {
      setError("Couldn't save that -- try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return { liked, count, isSaving, error, toggle };
}
