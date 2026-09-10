import { Show, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./Button";
import { ButtonVariant } from "../types/button";

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
              <Button variant={ButtonVariant.Nav}>Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant={ButtonVariant.Nav}>Sign up</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <SignOutButton>
              <Button variant={ButtonVariant.Nav}>Sign out</Button>
            </SignOutButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
