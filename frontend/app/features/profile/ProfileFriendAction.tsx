import { auth } from "@clerk/nextjs/server";
import { getFriendshipStatus } from "../../services/friendships";
import { FriendshipStatus } from "../../types/friendshipStatus";
import { FriendActionButton } from "./FriendActionButton";

// No button on your own profile, and none once you're already
// friends -- unfriending isn't offered from here. Everything else
// (not yet friends, pending, or signed out) renders one, prompting
// sign-in on click if needed, same as the watch-status button on
// media pages.
export async function ProfileFriendAction({ userId }: { userId: string }) {
  const { userId: viewerId, getToken } = await auth();

  if (viewerId === userId) {
    return null;
  }

  const token = viewerId ? await getToken() : null;
  const status = token
    ? await getFriendshipStatus(token, userId).catch(() => FriendshipStatus.None)
    : FriendshipStatus.None;

  if (status === FriendshipStatus.Accepted) {
    return null;
  }

  return <FriendActionButton userId={userId} initialStatus={status} />;
}
