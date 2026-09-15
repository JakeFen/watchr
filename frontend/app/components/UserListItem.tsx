import Link from "next/link";
import { PersonSilhouette } from "./PersonSilhouette";
import type { UserSummary } from "../types/userSummary";

export function UserListItem({
  user,
  avatarSizeClassName = "h-8 w-8",
}: {
  user: UserSummary;
  avatarSizeClassName?: string;
}) {
  return (
    <Link href={`/users/${user.id}`} className="flex items-center gap-3 text-zinc-200 hover:text-white">
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700 ${avatarSizeClassName}`}
      >
        <PersonSilhouette className="h-full w-full p-1.5" />
      </div>
      <span className="truncate text-sm">{user.username ?? "Unnamed"}</span>
    </Link>
  );
}
