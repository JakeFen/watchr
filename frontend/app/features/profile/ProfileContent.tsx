import { auth } from "@clerk/nextjs/server";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

export async function ProfileContent() {
  const { userId } = await auth();
  if (!userId) {
    return <p className="py-8 text-zinc-400">Sign in to see your profile.</p>;
  }

  return (
    <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
      <ProfileHeader />
      <ProfileStats />
    </div>
  );
}
