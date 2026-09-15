import { clerkClient } from "@clerk/nextjs/server";
import { PersonSilhouette } from "../../components/PersonSilhouette";

export async function ProfileHeader({ userId }: { userId: string }) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId).catch(() => null);
  const displayName = user?.username ?? user?.firstName ?? "Account";

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
        <PersonSilhouette className="h-full w-full p-4" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-100">{displayName}</h1>
    </div>
  );
}
