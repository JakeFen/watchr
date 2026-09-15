import { SearchFilter } from "../../types/searchFilter";
import { SearchBar } from "./SearchBar";
import { SearchResultsHeading } from "./SearchResultsHeading";
import { SearchResultsSection } from "./SearchResultsSection";

export function SearchContent({ query, filter }: { query: string; filter: SearchFilter }) {
  return (
    <div className="py-8">
      <SearchBar query={query} />
      <SearchResultsHeading query={query} />
      <SearchResultsSection query={query} initialFilter={filter} />
    </div>
  );
}
