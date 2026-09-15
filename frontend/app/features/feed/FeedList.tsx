"use client";

import { useState } from "react";
import { Button } from "../../components/Button";
import { ButtonVariant } from "../../types/button";
import type { FeedEntry } from "../../types/mediaEntry";
import type { UserSummary } from "../../types/userSummary";
import { FeedItem } from "./FeedItem";

export const PAGE_SIZE = 10;

// Feed.tsx (a server component) loads the first page. Clicking "View
// More" fetches the next page from /api/feed -- a route handler,
// since resolving entries and actor usernames both need server-only
// Clerk clients that a client component can't reach directly.
export function FeedList({
  initialEntries,
  initialActors,
}: {
  initialEntries: FeedEntry[];
  initialActors: UserSummary[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [actorById, setActorById] = useState(
    () => new Map(initialActors.map((actor) => [actor.id, actor])),
  );
  const [hasMore, setHasMore] = useState(initialEntries.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const response = await fetch(`/api/feed?limit=${PAGE_SIZE}&offset=${entries.length}`);
      if (!response.ok) {
        setHasMore(false);
        return;
      }
      const { entries: nextEntries, actors: nextActors }: { entries: FeedEntry[]; actors: UserSummary[] } =
        await response.json();

      setEntries((previous) => [...previous, ...nextEntries]);
      setActorById((previous) => {
        const next = new Map(previous);
        for (const actor of nextActors) {
          next.set(actor.id, actor);
        }
        return next;
      });
      setHasMore(nextEntries.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {entries.map((entry) => (
        <FeedItem key={entry.id} entry={entry} actor={actorById.get(entry.userId) ?? null} />
      ))}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button variant={ButtonVariant.Secondary} onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "View More"}
          </Button>
        </div>
      )}
    </div>
  );
}
