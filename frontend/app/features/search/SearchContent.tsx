import { SearchBar } from "./SearchBar";
import { SearchResultsHeading } from "./SearchResultsHeading";

export function SearchContent({ query }: { query: string }) {
  return (
    <div className="py-8">
      <SearchBar query={query} />
      <SearchResultsHeading query={query} />
    </div>
  );
}
