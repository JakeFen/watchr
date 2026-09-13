"use client";

import { useSyncExternalStore } from "react";

function formatActivityDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// This value never changes after mount, so there's nothing to
// subscribe to -- it's a no-op that never notifies.
function subscribe() {
  return () => {};
}

// Only the browser knows the viewer's real timezone -- the server has
// no way to format this correctly up front. useSyncExternalStore lets
// this render a stable placeholder (getServerSnapshot) during
// SSR/hydration and the locale-correct time once mounted
// client-side, without the setState-in-effect that a plain
// useState/useEffect version would need.
export function ActivityDate({ dateString }: { dateString: string }) {
  const formatted = useSyncExternalStore(
    subscribe,
    () => formatActivityDate(dateString),
    () => null,
  );

  return <p className="mt-1 text-xs text-zinc-500">{formatted}</p>;
}
