export function SearchHero() {
  return (
    <section className="-mx-4 bg-zinc-800 px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <p className="text-sm font-medium text-zinc-400">
        Search for films, shows, and friends
      </p>
      <input
        type="search"
        placeholder="Search films or users"
        className="mt-4 w-full max-w-sm rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      />
    </section>
  );
}
