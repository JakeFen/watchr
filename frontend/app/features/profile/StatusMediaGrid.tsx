import { MediaCard } from "../../components/MediaCard";
import type { MediaEntry } from "../../types/mediaEntry";
import { mediaEntryToMediaItem } from "./mediaEntryToMediaItem";
import { ratingStars } from "./ratingStars";

export function StatusMediaGrid({ entries }: { entries: MediaEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-zinc-500">Nothing here yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="w-24 sm:w-28">
          <p
            className={`mb-1 text-center text-sm ${entry.rating ? "text-green-400" : "text-zinc-700"}`}
          >
            {entry.rating ? ratingStars(entry.rating) : "☆☆☆☆☆"}
          </p>
          <MediaCard item={mediaEntryToMediaItem(entry)} sizeClassName="w-full" />
        </div>
      ))}
    </div>
  );
}
