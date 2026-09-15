"use client";

import { useRouter } from "next/navigation";
import { SearchInput } from "../../components/SearchInput";

export function SearchHero() {
  const router = useRouter();

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-blue-900/70 from-0% via-black via-90% to-zinc-900 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          Search for films, shows, and <span className="text-blue-400">friends</span>
        </h1>
        <SearchInput
          onSubmit={(query) => router.push(`/search?${new URLSearchParams({ q: query })}`)}
          className="mt-6 w-full"
        />
      </div>
    </section>
  );
}
