import type { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
      {children}
    </span>
  );
}
