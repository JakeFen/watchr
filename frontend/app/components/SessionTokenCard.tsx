// Marks this a Client Component so it runs in the browser, not just the server.
// Needed because it uses useState and an onClick handler, which only work client-side.
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export function SessionTokenCard() {
  const { getToken, isLoaded } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleFetchToken() {
    const t = await getToken();
    setToken(t);
    setCopied(false);
  }

  async function handleCopy() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-lg border border-black/[.08] p-4 dark:border-white/[.145]">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Grab a session token to use as a Bearer token in Postman. It expires
        quickly (~60s), so fetch a fresh one right before you need it.
      </p>
      <button
        onClick={handleFetchToken}
        disabled={!isLoaded}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        Get session token
      </button>
      {token && (
        <>
          <textarea
            readOnly
            value={token}
            rows={4}
            className="w-full resize-none rounded border border-black/[.08] bg-black/[.02] p-2 font-mono text-xs dark:border-white/[.145] dark:bg-white/[.04]"
          />
          <button
            onClick={handleCopy}
            className="self-start rounded-full border border-black/[.08] px-4 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </>
      )}
    </div>
  );
}
