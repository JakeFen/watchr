import { searchMedia } from "../../services/tmdb";
import { searchUsers } from "../../services/users";
import type { SearchFilter } from "../../types/searchFilter";
import { SearchFilterableResults } from "./SearchFilterableResults";

export async function SearchResultsSection({
  query,
  initialFilter,
}: {
  query: string;
  initialFilter: SearchFilter;
}) {
  const [users, films] = query
    ? await Promise.all([searchUsers(query).catch(() => []), searchMedia(query).catch(() => [])])
    : [[], []];

  return <SearchFilterableResults users={users} films={films} initialFilter={initialFilter} />;
}
