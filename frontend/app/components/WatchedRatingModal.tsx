"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ButtonVariant } from "../types/button";

const RATING_VALUES = [1, 2, 3, 4, 5];

export function WatchedRatingModal({
  isSaving,
  onSave,
}: {
  isSaving: boolean;
  onSave: (rating: number | null, review: string | null) => Promise<boolean>;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSave(nextRating: number | null, nextReview: string | null) {
    if (isSaving) return;
    setError(null);
    const success = await onSave(nextRating, nextReview);
    if (!success) {
      setError("Couldn't save that -- try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => handleSave(null, null)}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-zinc-800 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-100">
          Would you like to leave a rating or review?
        </h2>

        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-300">Rating:</p>
          <div className="mt-2 flex gap-1">
            {RATING_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value === rating ? null : value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className="cursor-pointer text-2xl leading-none"
              >
                <span className={value <= (rating ?? 0) ? "text-green-400" : "text-zinc-600"}>★</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="media-review" className="text-sm font-medium text-zinc-300">
            Review:
          </label>
          <textarea
            id="media-review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            rows={4}
            placeholder="What did you think?"
            className="mt-2 w-full resize-none rounded border border-zinc-600 bg-zinc-900 p-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave(null, null)}
            className="cursor-pointer px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 disabled:cursor-wait disabled:opacity-60"
          >
            Skip
          </button>
          <Button
            variant={ButtonVariant.Primary}
            disabled={isSaving}
            onClick={() => handleSave(rating, review.trim() || null)}
            className="px-5 py-2.5 text-sm"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
