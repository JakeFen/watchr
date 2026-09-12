import type { MediaDetails } from "../../../types/media";

export function MediaOverview({ details }: { details: MediaDetails }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-zinc-100">Overview</h2>
      <p className="mt-3 leading-relaxed text-zinc-300">{details.overview}</p>

      {details.directors.length > 0 && (
        <p className="mt-4 text-sm text-zinc-400">
          <span className="text-zinc-500">Director: </span>
          {details.directors.join(", ")}
        </p>
      )}
    </div>
  );
}
