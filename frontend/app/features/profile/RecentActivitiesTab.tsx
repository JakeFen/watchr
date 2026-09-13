"use client";

import { useState } from "react";
import { Button } from "../../components/Button";
import { ButtonVariant } from "../../types/button";
import type { MediaEntry } from "../../types/mediaEntry";
import { ActivityRow } from "./ActivityRow";

// Starts with just a page's worth of the most recently-updated
// entries and loads another page at a time via "View More" -- entries
// are already fetched up front, so this is just revealing more of
// what's already in memory, not a new request.
const PAGE_SIZE = 5;

export function RecentActivitiesTab({ entries }: { entries: MediaEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = entries.slice(0, visibleCount);

  if (visible.length === 0) {
    return <p className="text-sm text-zinc-500">Nothing here yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col">
        {visible.map((entry) => (
          <ActivityRow key={entry.id} entry={entry} />
        ))}
      </div>

      {visibleCount < entries.length && (
        <Button
          variant={ButtonVariant.Secondary}
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mt-4 block w-full py-1.5 text-center text-sm"
        >
          View More
        </Button>
      )}
    </div>
  );
}
