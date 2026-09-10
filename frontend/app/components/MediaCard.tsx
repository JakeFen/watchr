import Image from "next/image";

export type MediaItem = {
  id: string;
  title: string;
  imageUrl?: string;
};

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="flex w-36 shrink-0 flex-col gap-2 sm:w-44">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(min-width: 640px) 11rem, 9rem"
            className="object-cover"
          />
        )}
      </div>
      <p className="truncate text-sm font-medium text-zinc-200">{item.title}</p>
    </div>
  );
}
