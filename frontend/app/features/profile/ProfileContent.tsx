import { FriendsList } from "./FriendsList";
import { ProfileFriendAction } from "./ProfileFriendAction";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { ProfileTabsContent } from "./ProfileTabsContent";

export function ProfileContent({ userId }: { userId: string }) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <ProfileHeader userId={userId} />
          <ProfileFriendAction userId={userId} />
        </div>
        <ProfileStats userId={userId} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <ProfileTabsContent userId={userId} />
        </div>
        <FriendsList userId={userId} />
      </div>
    </div>
  );
}
