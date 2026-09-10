import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-zinc-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-zinc-400 sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; {year} Watchr. All rights reserved.</p>
        <Link href="/discover" className="transition-colors hover:text-white">
          Discover
        </Link>
      </div>
    </footer>
  );
}
