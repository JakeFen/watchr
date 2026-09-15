import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "../../types/media";

export function SearchFilmRow({ item }: { item: MediaItem }) {
  return (
    <Link
      href={`/discover/${item.id}?type=${item.mediaType}`}
      className="flex gap-4 text-zinc-200 hover:text-white"
    >
      <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded bg-zinc-800">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.title} fill sizes="56px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-zinc-100">{item.title}</p>
        {item.overview && <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.overview}</p>}
      </div>
    </Link>
  );
}
