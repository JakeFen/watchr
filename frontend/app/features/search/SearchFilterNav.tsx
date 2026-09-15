"use client";

import { useRouter } from "next/navigation";
import { SearchFilter } from "../../types/searchFilter";

const FILTERS: { label: string; value: SearchFilter }[] = [
  { label: "All", value: SearchFilter.All },
  { label: "Films", value: SearchFilter.Films },
  { label: "Users", value: SearchFilter.Users },
];

export function SearchFilterNav({ query, filter }: { query: string; filter: SearchFilter }) {
  const router = useRouter();

  return (
    <nav className="flex gap-2 sm:w-40 sm:flex-col">
      {FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() =>
            router.replace(`/search?${new URLSearchParams({ q: query, type: option.value })}`)
          }
          className={`cursor-pointer rounded px-4 py-2 text-left text-sm font-medium transition-colors ${
            option.value === filter
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </nav>
  );
}
