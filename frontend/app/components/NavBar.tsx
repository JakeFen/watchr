import { Show, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-900">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-semibold text-zinc-100">
          Watchr
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-base font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Discover
          </Link>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="cursor-pointer text-base font-semibold text-zinc-300 transition-colors hover:text-white">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="cursor-pointer text-base font-semibold text-zinc-300 transition-colors hover:text-white">
                Sign up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <SignOutButton>
              <button className="cursor-pointer text-base font-semibold text-zinc-300 transition-colors hover:text-white">
                Sign out
              </button>
            </SignOutButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
