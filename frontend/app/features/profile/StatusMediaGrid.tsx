import { MediaCard } from "../../components/MediaCard";
import type { MediaEntry } from "../../types/mediaEntry";
import { mediaEntryToMediaItem } from "./mediaEntryToMediaItem";

export function StatusMediaGrid({ entries }: { entries: MediaEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-zinc-500">Nothing here yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map((entry) => (
        <MediaCard key={entry.id} item={mediaEntryToMediaItem(entry)} sizeClassName="w-24 sm:w-28" />
      ))}
    </div>
  );
}
