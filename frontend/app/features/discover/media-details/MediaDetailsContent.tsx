import { notFound } from "next/navigation";
import { MediaRow } from "../../../components/MediaRow";
import { getMediaDetails } from "../../../services/tmdb";
import { TmdbMediaType } from "../../../types/tmdb";
import { MediaBackdrop } from "./MediaBackdrop";
import { MediaCastRow } from "./MediaCastRow";
import { MediaDetailsFacts } from "./MediaDetailsFacts";
import { MediaHeader } from "./MediaHeader";
import { MediaOverview } from "./MediaOverview";

export async function MediaDetailsContent({ id, type }: { id: string; type?: string }) {
  const mediaType = type === TmdbMediaType.Tv ? TmdbMediaType.Tv : TmdbMediaType.Movie;

  const details = await getMediaDetails(id, mediaType).catch(() => null);
  if (!details) {
    notFound();
  }

  return (
    <div className="pb-16">
      <MediaBackdrop backdropUrl={details.backdropUrl} />

      <div className="relative -mt-56 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MediaHeader details={details} />
          <MediaOverview details={details} />
        </div>

        <MediaDetailsFacts details={details} />
      </div>

      <MediaCastRow cast={details.cast} />

      {details.similar.length > 0 && <MediaRow title="More Like This" items={details.similar} />}
    </div>
  );
}
