"use client";

import { useLike } from "../../hooks/useLike";

export function LikeButton({
  mediaEntryId,
  initialLiked,
  initialCount,
}: {
  mediaEntryId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const { liked, count, isSaving, error, toggle } = useLike({
    mediaEntryId,
    initialLiked,
    initialCount,
  });

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={toggle}
        disabled={isSaving}
        className={`flex cursor-pointer items-center gap-1 text-sm disabled:cursor-wait disabled:opacity-60 ${
          liked ? "text-red-400" : "text-zinc-400 hover:text-red-400"
        }`}
      >
        <span className="text-base">{liked ? "♥" : "♡"}</span>
        {liked ? "Liked" : "Like"}
        {count > 0 && <span className="text-zinc-500">· {count}</span>}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
