"use client";

import { Button } from "../../components/Button";
import { useFriendship } from "../../hooks/useFriendship";
import { ButtonVariant } from "../../types/button";
import { FriendshipStatus } from "../../types/friendshipStatus";

const BUTTON_LABEL: Record<FriendshipStatus, string> = {
  [FriendshipStatus.None]: "Add Friend",
  [FriendshipStatus.Pending]: "Pending",
  [FriendshipStatus.Accepted]: "Remove Friend",
};

export function FriendActionButton({
  userId,
  initialStatus,
}: {
  userId: string;
  initialStatus: FriendshipStatus;
}) {
  const { status, isSaving, error, add, remove } = useFriendship({
    userId,
    initialStatus,
  });

  const isNone = status === FriendshipStatus.None;

  return (
    <div>
      <Button
        variant={isNone ? ButtonVariant.Primary : ButtonVariant.Secondary}
        disabled={isSaving}
        onClick={isNone ? add : remove}
      >
        {BUTTON_LABEL[status]}
      </Button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
