import Link from "next/link";
import { PersonSilhouette } from "../../components/PersonSilhouette";
import type { Friend } from "../../types/friend";

export function FriendListItem({
  friend,
  avatarSizeClassName = "h-8 w-8",
}: {
  friend: Friend;
  avatarSizeClassName?: string;
}) {
  return (
    <Link href={`/users/${friend.id}`} className="flex items-center gap-3 text-zinc-200 hover:text-white">
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700 ${avatarSizeClassName}`}
      >
        <PersonSilhouette className="h-full w-full p-1.5" />
      </div>
      <span className="truncate text-sm">{friend.username ?? "Unnamed"}</span>
    </Link>
  );
}
