export function SearchResultsHeading({ query }: { query: string }) {
  return (
    <h1 className="mt-6 text-2xl font-bold text-zinc-100">
      Search results{query && ` for "${query}"`}
    </h1>
  );
}
