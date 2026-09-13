import { listMediaEntriesForUser } from "../../services/mediaEntries";
import { WatchStatus } from "../../types/media";

export async function ProfileStats({ userId }: { userId: string }) {
  const entries = await listMediaEntriesForUser(userId).catch(() => []);

  const stats = [
    { label: "Watched", count: entries.filter((e) => e.status === WatchStatus.Watched).length },
    { label: "Watching", count: entries.filter((e) => e.status === WatchStatus.Watching).length },
    {
      label: "Want to Watch",
      count: entries.filter((e) => e.status === WatchStatus.WantToWatch).length,
    },
  ];

  return (
    <div className="flex gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-2xl font-bold text-zinc-100">{stat.count}</p>
          <p className="text-sm text-zinc-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
