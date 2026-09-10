export function SearchHero() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-blue-900/70 via-blue-950/30 to-zinc-800 py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          Search for films, shows, and <span className="text-blue-400">friends</span>
        </h1>
        <input
          type="search"
          placeholder="Search films or users"
          className="mt-6 w-full rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </section>
  );
}
