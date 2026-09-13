import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

export function ProfileContent({ userId }: { userId: string }) {
  return (
    <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
      <ProfileHeader />
      <ProfileStats userId={userId} />
    </div>
  );
}
