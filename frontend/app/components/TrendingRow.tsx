import { MediaCard, type MediaItem } from "./MediaCard";

export function TrendingRow({
  title,
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-100">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
