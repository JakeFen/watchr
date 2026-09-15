import Image from "next/image";
import Link from "next/link";
import { WatchStatus } from "../../types/media";
import type { MediaEntry } from "../../types/mediaEntry";
import { ActivityDate } from "./ActivityDate";
import { mediaEntryToMediaItem } from "./mediaEntryToMediaItem";
import { ratingStars } from "./ratingStars";

const ACTION_VERB: Record<WatchStatus, string> = {
  [WatchStatus.Watched]: "watched",
  [WatchStatus.Watching]: "is watching",
  [WatchStatus.WantToWatch]: "wants to watch",
};

export function ActivityRow({ entry }: { entry: MediaEntry }) {
  const item = mediaEntryToMediaItem(entry);
  const href = `/discover/${item.id}?type=${item.mediaType}`;

  return (
    <div className="flex gap-4 border-b border-zinc-800 py-4 last:border-b-0">
      <Link
        href={href}
        className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded bg-zinc-800"
      >
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-400">
          {ACTION_VERB[entry.status]}
          {entry.status === WatchStatus.Watched && entry.rating && (
            <span className="ml-2 text-green-400">
              {ratingStars(entry.rating)}
            </span>
          )}
        </p>
        <Link
          href={href}
          className="font-semibold text-zinc-100 hover:underline"
        >
          {item.title}
        </Link>
        {entry.review && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-400 italic">
            &ldquo;{entry.review}&rdquo;
          </p>
        )}
        <ActivityDate dateString={entry.updatedAt} />
      </div>
    </div>
  );
}
