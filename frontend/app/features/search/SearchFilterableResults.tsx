"use client";

import { useState } from "react";
import type { MediaItem } from "../../types/media";
import { SearchFilter } from "../../types/searchFilter";
import type { UserSummary } from "../../types/userSummary";
import { SearchFilterNav } from "./SearchFilterNav";
import { SearchResults } from "./SearchResults";

// users and films are fetched once, up front -- switching between
// All/Films/Users just filters what's already in memory, no new call.
export function SearchFilterableResults({
  users,
  films,
  initialFilter,
}: {
  users: UserSummary[];
  films: MediaItem[];
  initialFilter: SearchFilter;
}) {
  const [filter, setFilter] = useState(initialFilter);

  const visibleUsers = filter === SearchFilter.Films ? [] : users;
  const visibleFilms = filter === SearchFilter.Users ? [] : films;

  return (
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
      <SearchFilterNav
        filter={filter}
        onChange={setFilter}
        allCount={users.length + films.length}
        filmCount={films.length}
        userCount={users.length}
      />
      <div className="min-w-0 flex-1">
        <SearchResults users={visibleUsers} films={visibleFilms} />
      </div>
    </div>
  );
}
