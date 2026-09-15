import { SearchContent } from "../../features/search/SearchContent";
import { SearchFilter } from "../../types/searchFilter";

function parseFilter(type: string | undefined): SearchFilter {
  return Object.values(SearchFilter).includes(type as SearchFilter)
    ? (type as SearchFilter)
    : SearchFilter.All;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;

  return <SearchContent query={q ?? ""} filter={parseFilter(type)} />;
}
