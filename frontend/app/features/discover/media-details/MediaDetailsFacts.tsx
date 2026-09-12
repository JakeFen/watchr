import Image from "next/image";
import type { MediaDetails } from "../../../types/media";
import { formatDate, formatMoney } from "./mediaFormat";

export function MediaDetailsFacts({ details }: { details: MediaDetails }) {
  const facts: { label: string; value: string }[] = [
    { label: "Status", value: details.status },
    ...(details.releaseDate
      ? [{ label: "Release Date", value: formatDate(details.releaseDate) }]
      : []),
    ...(details.budget !== undefined
      ? [{ label: "Budget", value: formatMoney(details.budget) }]
      : []),
    ...(details.revenue !== undefined
      ? [{ label: "Revenue", value: formatMoney(details.revenue) }]
      : []),
    ...(details.productionCompanies.length > 0
      ? [{ label: "Production", value: details.productionCompanies.join(", ") }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-zinc-800/50 p-5 text-sm">
      <h2 className="text-base font-semibold text-zinc-100">Details</h2>
      <dl className="flex flex-col gap-2">
        {facts.map((fact) => (
          <div key={fact.label} className="flex justify-between gap-4">
            <dt className="text-zinc-500">{fact.label}</dt>
            <dd className="text-right text-zinc-300">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {details.watchProviders.length > 0 && (
        <div className="mt-2 border-t border-zinc-700 pt-3">
          <p className="mb-2 text-zinc-500">Streaming On</p>
          <div className="flex flex-wrap gap-2">
            {details.watchProviders.map((provider) => (
              <div
                key={provider.name}
                title={provider.name}
                className="relative h-9 w-9 overflow-hidden rounded-md"
              >
                <Image src={provider.logoUrl} alt={provider.name} fill sizes="2.25rem" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-3 border-t border-zinc-700 pt-3">
        {details.imdbUrl && (
          <a
            href={details.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            IMDb
          </a>
        )}
      </div>
    </div>
  );
}
