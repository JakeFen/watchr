import { Chip } from "./Chip";
import { HorizontalFadeScroll } from "./HorizontalFadeScroll";
import { MediaCard } from "./MediaCard";
import type { ChipProps } from "../types/chip";
import type { MediaItem } from "../types/media";

export function MediaRow<T extends string = string>({
  title,
  items,
  chips,
}: {
  title: string;
  items: MediaItem[];
  chips?: ChipProps<T>;
}) {
  return (
    <section className="py-8">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        {chips && (
          <Chip options={chips.options} value={chips.value} onChange={chips.onChange} />
        )}
      </div>
      <HorizontalFadeScroll>
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </HorizontalFadeScroll>
    </section>
  );
}
