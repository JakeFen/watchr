"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.username ?? user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer text-base font-semibold text-zinc-300 transition-colors hover:text-white"
      >
        {displayName} ▾
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl">
            <Link
              href={`/users/${user!.id}`}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Profile
            </Link>
            <SignOutButton>
              <button
                type="button"
                className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-700"
              >
                Sign out
              </button>
            </SignOutButton>
          </div>
        </>
      )}
    </div>
  );
}
