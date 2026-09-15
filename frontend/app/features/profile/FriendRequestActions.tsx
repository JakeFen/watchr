"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../components/Button";
import { acceptFriendRequest, removeFriendship } from "../../services/friendshipsClient";
import { ButtonVariant } from "../../types/button";

export function FriendRequestActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function respond(action: (id: string) => Promise<void>, failureMessage: string) {
    setIsSaving(true);
    setError(null);
    try {
      await action(userId);
      router.refresh();
    } catch {
      setError(failureMessage);
      setIsSaving(false);
    }
  }

  return (
    <div className="shrink-0">
      <div className="flex gap-2">
        <Button
          variant={ButtonVariant.Primary}
          disabled={isSaving}
          onClick={() => respond(acceptFriendRequest, "Couldn't accept -- try again.")}
          className="flex h-8 w-8 items-center justify-center p-0"
        >
          ✓
        </Button>
        <Button
          variant={ButtonVariant.Secondary}
          disabled={isSaving}
          onClick={() => respond(removeFriendship, "Couldn't reject -- try again.")}
          className="flex h-8 w-8 items-center justify-center p-0"
        >
          ✕
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
