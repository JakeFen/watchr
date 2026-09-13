import { WatchStatus } from "../../types/media";
import type { MediaEntry } from "../../types/mediaEntry";
import { StatusMediaGrid } from "./StatusMediaGrid";

export function WatchingTab({ entries }: { entries: MediaEntry[] }) {
  return <StatusMediaGrid entries={entries.filter((entry) => entry.status === WatchStatus.Watching)} />;
}
