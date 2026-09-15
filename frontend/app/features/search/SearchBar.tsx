"use client";

import { useRouter } from "next/navigation";
import { SearchInput } from "../../components/SearchInput";

export function SearchBar({ query }: { query: string }) {
  const router = useRouter();

  return (
    <SearchInput
      initialValue={query}
      onSubmit={(next) => router.replace(`/search?${new URLSearchParams({ q: next })}`)}
      className="w-full max-w-2xl"
    />
  );
}
