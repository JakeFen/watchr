"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { removeFriendship, sendFriendRequest } from "../services/friendshipsClient";
import { FriendshipStatus } from "../types/friendshipStatus";

export function useFriendship({
  userId,
  initialStatus,
}: {
  userId: string;
  initialStatus: FriendshipStatus;
}) {
  const { openSignIn } = useClerk();
  // Read live client-side auth state rather than trusting a signed-in
  // flag baked into the server-rendered page -- if that render is
  // served from the Router Cache after the user signs in elsewhere,
  // a stale "signed out" snapshot would wrongly call openSignIn()
  // while a real session is already active.
  const { isSignedIn } = useAuth();
  const [status, setStatus] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function requireSignIn(): boolean {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }
    return true;
  }

  async function add() {
    if (!requireSignIn()) return;

    setIsSaving(true);
    setError(null);
    try {
      await sendFriendRequest(userId);
      setStatus(FriendshipStatus.Pending);
    } catch {
      setError("Couldn't send that -- try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function remove() {
    if (!requireSignIn()) return;

    setIsSaving(true);
    setError(null);
    try {
      await removeFriendship(userId);
      setStatus(FriendshipStatus.None);
    } catch {
      setError("Couldn't remove that -- try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return { status, isSaving, error, add, remove };
}
