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

const BUTTON_VARIANT: Record<FriendshipStatus, ButtonVariant> = {
  [FriendshipStatus.None]: ButtonVariant.Primary,
  [FriendshipStatus.Pending]: ButtonVariant.Secondary,
  [FriendshipStatus.Accepted]: ButtonVariant.Danger,
};

export function FriendActionButton({
  userId,
  initialStatus,
  className,
}: {
  userId: string;
  initialStatus: FriendshipStatus;
  className?: string;
}) {
  const { status, isSaving, error, add, remove } = useFriendship({
    userId,
    initialStatus,
  });

  return (
    <div className="shrink-0">
      <Button
        variant={BUTTON_VARIANT[status]}
        disabled={isSaving}
        onClick={status === FriendshipStatus.None ? add : remove}
        className={className}
      >
        {BUTTON_LABEL[status]}
      </Button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
