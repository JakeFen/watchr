import { SearchFilter } from "../../types/searchFilter";
import { SearchBar } from "./SearchBar";
import { SearchFilterNav } from "./SearchFilterNav";
import { SearchResults } from "./SearchResults";
import { SearchResultsHeading } from "./SearchResultsHeading";

export function SearchContent({ query, filter }: { query: string; filter: SearchFilter }) {
  return (
    <div className="py-8">
      <SearchBar query={query} />
      <SearchResultsHeading query={query} />

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <SearchFilterNav query={query} filter={filter} />
        <div className="min-w-0 flex-1">
          <SearchResults />
        </div>
      </div>
    </div>
  );
}
