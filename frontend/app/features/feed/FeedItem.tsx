import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/Button";
import { PersonSilhouette } from "../../components/PersonSilhouette";
import { ButtonVariant } from "../../types/button";
import { WatchStatus } from "../../types/media";
import type { FeedEntry } from "../../types/mediaEntry";
import type { UserSummary } from "../../types/userSummary";
import { ActivityDate } from "../profile/ActivityDate";
import { mediaEntryToMediaItem } from "../profile/mediaEntryToMediaItem";
import { ratingStars } from "../profile/ratingStars";
import { LikeButton } from "./LikeButton";

const ACTION_VERB: Record<WatchStatus, string> = {
  [WatchStatus.Watched]: "watched",
  [WatchStatus.Watching]: "is watching",
  [WatchStatus.WantToWatch]: "wants to watch",
};

// Comments are visual only for now -- no backend support yet, so
// nothing here is wired to save anything. Liking is wired up for
// real, and only lives here -- FeedItem is currently only ever
// rendered from the feed.
export function FeedItem({ entry, actor }: { entry: FeedEntry; actor: UserSummary | null }) {
  const item = mediaEntryToMediaItem(entry);
  const href = `/discover/${item.id}?type=${item.mediaType}`;
  const profileHref = `/users/${entry.userId}`;

  return (
    <div className="border-b border-zinc-800 py-6 last:border-b-0">
      <div className="mb-3 flex items-center gap-2">
        <Link
          href={profileHref}
          className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700"
        >
          <PersonSilhouette className="h-full w-full p-1.5" />
        </Link>
        <Link href={profileHref} className="text-sm font-semibold text-zinc-200 hover:underline">
          {actor?.username ?? "Someone"}
        </Link>
        <span className="text-sm text-zinc-500">{ACTION_VERB[entry.status]}</span>
      </div>

      <div className="flex gap-3">
        <Link
          href={href}
          className="relative aspect-[2/3] w-28 shrink-0 self-start overflow-hidden rounded bg-zinc-800"
        >
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.title} fill sizes="112px" className="object-cover" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <Link href={href} className="font-semibold text-zinc-100 hover:underline">
              {item.title}
            </Link>
            <ActivityDate dateString={entry.updatedAt} className="text-xs text-zinc-500" />
          </div>

          {entry.status === WatchStatus.Watched && entry.rating && (
            <p className="mt-1 text-xl text-green-400">{ratingStars(entry.rating)}</p>
          )}

          {entry.review && (
            <blockquote className="mt-2 rounded-lg border-l-4 border-green-500/50 bg-zinc-800/50 py-2 pl-3 text-sm text-zinc-200 italic">
              &ldquo;{entry.review}&rdquo;
            </blockquote>
          )}

          <LikeButton mediaEntryId={entry.id} initialLiked={entry.likedByMe} initialCount={entry.likeCount} />
        </div>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          placeholder="Write a comment..."
          rows={2}
          className="flex-1 resize-none rounded border border-zinc-700 bg-zinc-900 p-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
        <Button variant={ButtonVariant.Primary} className="px-4 py-1.5 text-sm">
          Post
        </Button>
      </div>
    </div>
  );
}
