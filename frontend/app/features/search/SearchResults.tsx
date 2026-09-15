import { UserListItem } from "../../components/UserListItem";
import type { MediaItem } from "../../types/media";
import type { UserSummary } from "../../types/userSummary";
import { SearchFilmRow } from "./SearchFilmRow";

export function SearchResults({ users, films }: { users: UserSummary[]; films: MediaItem[] }) {
  if (users.length === 0 && films.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 p-8">
        <p className="text-sm text-zinc-500">No results found.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {films.map((item) => (
        <li key={`film-${item.id}`} className="border-b border-zinc-800 py-3 first:pt-0 last:border-b-0 last:pb-0">
          <SearchFilmRow item={item} />
        </li>
      ))}
      {users.map((user) => (
        <li key={`user-${user.id}`} className="border-b border-zinc-800 py-3 first:pt-0 last:border-b-0 last:pb-0">
          <UserListItem user={user} avatarSizeClassName="h-14 w-14" />
        </li>
      ))}
    </ul>
  );
}
