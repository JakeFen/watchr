import { SearchFilter } from "../../types/searchFilter";

export function SearchFilterNav({
  filter,
  onChange,
  allCount,
  filmCount,
  userCount,
}: {
  filter: SearchFilter;
  onChange: (filter: SearchFilter) => void;
  allCount: number;
  filmCount: number;
  userCount: number;
}) {
  const options = [
    { label: `All (${allCount})`, value: SearchFilter.All },
    { label: `Films (${filmCount})`, value: SearchFilter.Films },
    { label: `Users (${userCount})`, value: SearchFilter.Users },
  ];

  return (
    <nav className="flex gap-2 sm:w-40 sm:flex-col">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`cursor-pointer rounded px-4 py-2 text-left text-sm font-medium transition-colors ${
            option.value === filter
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </nav>
  );
}
