"use client";

import { useState } from "react";
import { Button } from "./Button";
import { useMediaEntry } from "../hooks/useMediaEntry";
import { ButtonVariant } from "../types/button";
import { WatchStatus } from "../types/media";
import type { MediaEntry } from "../types/mediaEntry";
import type { TmdbMediaType } from "../types/tmdb";

const ALL_STATUSES: WatchStatus[] = [WatchStatus.WantToWatch, WatchStatus.Watching, WatchStatus.Watched];

const STATUS_LABEL: Record<WatchStatus, string> = {
  [WatchStatus.WantToWatch]: "Want to Watch",
  [WatchStatus.Watching]: "Watching",
  [WatchStatus.Watched]: "Watched",
};

export function MediaActions({
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
  const { status, isSaving, error, setStatus, remove } = useMediaEntry({
    mediaType,
    tmdbId,
    title,
    posterPath,
    initialEntry,
    isSignedIn,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The primary segment always reflects whatever status is actually
  // set (e.g. "✓ Watching"), not just "Watched" -- it only falls back
  // to a plain "Watched" CTA once nothing has been chosen yet. The
  // dropdown offers whichever two statuses aren't the current one.
  const hasStatus = status !== null;
  const primaryStatus = status ?? WatchStatus.Watched;
  const dropdownStatuses = ALL_STATUSES.filter((value) => value !== primaryStatus);

  async function handleStatusClick(next: WatchStatus) {
    setIsMenuOpen(false);

    if (status === next) {
      if (
        confirm(
          `Remove "${title}" from your ${STATUS_LABEL[next]} list? This will also delete any rating, review, comments, and likes on it.`
        )
      ) {
        await remove();
      }
      return;
    }

    await setStatus(next);
    if (next === WatchStatus.Watched) {
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <div className="relative inline-flex">
        <div
          className={`inline-flex rounded text-base font-semibold ${
            hasStatus
              ? "divide-x divide-blue-400 bg-blue-500 text-white"
              : "text-zinc-200"
          }`}
        >
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleStatusClick(primaryStatus)}
            className={`relative cursor-pointer rounded-l px-5 py-2.5 transition-colors disabled:cursor-wait disabled:opacity-60 ${
              hasStatus
                ? "hover:z-10 hover:bg-blue-400"
                : "border border-zinc-600 hover:z-10 hover:border-zinc-400 hover:text-white"
            }`}
          >
            {hasStatus ? `✓ ${STATUS_LABEL[primaryStatus]}` : STATUS_LABEL[primaryStatus]}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="More watch status options"
            className={`relative cursor-pointer rounded-r px-3 py-2.5 transition-colors disabled:cursor-wait disabled:opacity-60 ${
              hasStatus
                ? "hover:z-10 hover:bg-blue-400"
                : "-ml-px border border-zinc-600 hover:z-10 hover:border-zinc-400 hover:text-white"
            }`}
          >
            ▾
          </button>
        </div>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-full left-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl">
              {dropdownStatuses.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStatusClick(value)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-700"
                >
                  {STATUS_LABEL[value]}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p className="absolute top-full left-0 mt-1 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-zinc-800 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-100">
              Marked as watched
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Want to leave your thoughts?
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Button
                variant={ButtonVariant.Primary}
                className="w-full"
                onClick={() => setIsModalOpen(false)}
              >
                Leave a Rating
              </Button>
              <Button
                variant={ButtonVariant.Secondary}
                className="w-full"
                onClick={() => setIsModalOpen(false)}
              >
                Leave a Review
              </Button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-1 cursor-pointer text-sm text-zinc-500 hover:text-zinc-300"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
