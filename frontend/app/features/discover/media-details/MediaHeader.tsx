import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/Button";
import { MediaActions } from "../../../components/MediaActions";
import { PillList } from "../../../components/PillList";
import type { MediaDetails } from "../../../types/media";
import type { MediaEntry } from "../../../types/mediaEntry";
import { formatDate } from "./mediaFormat";

export type MediaActionsProps = {
  initialEntry: MediaEntry | null;
  isSignedIn: boolean;
};

export function MediaHeader({
  details,
  mediaActions,
}: {
  details: MediaDetails;
  mediaActions: MediaActionsProps;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg bg-zinc-800 shadow-xl sm:w-56">
        {details.posterUrl && (
          <Image
            src={details.posterUrl}
            alt={details.title}
            fill
            sizes="(min-width: 640px) 14rem, 10rem"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        {/* Back link */}
        <Link href="/discover" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Discover
        </Link>

        {/* Title and tagline */}
        <h1 className="mt-2 text-3xl font-bold text-zinc-100 sm:text-4xl">{details.title}</h1>
        {details.tagline && <p className="mt-1 text-zinc-400 italic">{details.tagline}</p>}

        {/* Year, runtime, and rating */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-300">
          {details.releaseDate && (
            <span>{formatDate(details.releaseDate).split(",")[1]?.trim()}</span>
          )}
          {details.runtimeLabel && <span>{details.runtimeLabel}</span>}
          {details.rating !== undefined && (
            <span className="font-semibold text-zinc-100">
              ★ {details.rating.toFixed(1)}{" "}
              <span className="font-normal text-zinc-400">
                ({details.voteCount.toLocaleString()})
              </span>
            </span>
          )}
        </div>

        {/* Genre pills */}
        <PillList items={details.genres} className="mt-3" />

        {/* Trailer link and watch-status actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {details.trailerUrl && (
            <Button href={details.trailerUrl} target="_blank" rel="noopener noreferrer">
              ▶ Watch Trailer
            </Button>
          )}
          <MediaActions
            mediaType={details.mediaType}
            tmdbId={Number(details.id)}
            title={details.title}
            posterPath={details.posterPath}
            initialEntry={mediaActions.initialEntry}
            isSignedIn={mediaActions.isSignedIn}
          />
        </div>
      </div>
    </div>
  );
}
