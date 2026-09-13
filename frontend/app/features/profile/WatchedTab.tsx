import { WatchStatus } from "../../types/media";
import type { MediaEntry } from "../../types/mediaEntry";
import { StatusMediaGrid } from "./StatusMediaGrid";

export function WatchedTab({ entries }: { entries: MediaEntry[] }) {
  return <StatusMediaGrid entries={entries.filter((entry) => entry.status === WatchStatus.Watched)} />;
}
