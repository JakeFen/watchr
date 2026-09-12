import Image from "next/image";
import { HorizontalFadeScroll } from "../../../components/HorizontalFadeScroll";
import type { MediaCastMember } from "../../../types/media";

export function MediaCastRow({ cast }: { cast: MediaCastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-zinc-100">Cast</h2>
      <HorizontalFadeScroll>
        {cast.map((member) => (
          <div key={member.id} className="flex w-28 shrink-0 flex-col gap-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-zinc-700">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  sizes="7rem"
                  className="object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full p-5 text-zinc-500"
                >
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <p className="truncate text-sm font-medium text-zinc-200">{member.name}</p>
              <p className="truncate text-xs text-zinc-500">{member.character}</p>
            </div>
          </div>
        ))}
      </HorizontalFadeScroll>
    </section>
  );
}
