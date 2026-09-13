import Image from "next/image";
import { HorizontalFadeScroll } from "../../../components/HorizontalFadeScroll";
import { PersonSilhouette } from "../../../components/PersonSilhouette";
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
                <PersonSilhouette className="absolute inset-0 h-full w-full p-5" />
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
