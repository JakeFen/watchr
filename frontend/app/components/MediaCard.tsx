import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "../types/media";

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <Link href={`/discover/${item.id}`} className="group flex w-36 shrink-0 flex-col gap-2 sm:w-44">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring-1 after:inset-ring-transparent after:transition-all after:content-[''] hover:after:inset-ring-2 hover:after:inset-ring-blue-400">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(min-width: 640px) 11rem, 9rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {/* Rating */}
        {item.rating !== undefined && (
          <div className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1 text-base font-semibold text-zinc-100">
            ★ {item.rating.toFixed(1)}
          </div>
        )}
      </div>
      <p className="truncate text-sm font-medium text-zinc-200">{item.title}</p>
    </Link>
  );
}
