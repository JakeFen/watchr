import { auth } from "@clerk/nextjs/server";
import { UserListItem } from "../../components/UserListItem";
import { getFriendshipStatus, listFriendsForUser } from "../../services/friendships";
import { getUsersByIds } from "../../services/users";
import { FriendshipStatus } from "../../types/friendshipStatus";
import { FriendActionButton } from "./FriendActionButton";

export async function FriendsPageContent({ userId }: { userId: string }) {
  const { userId: viewerId, getToken } = await auth();
  const token = viewerId ? await getToken() : null;

  const friends = await listFriendsForUser(userId)
    .then(getUsersByIds)
    .catch(() => []);

  // Each row shows the viewer's own relationship to that friend --
  // Add/Pending/Remove -- not a role tied to whose friends page this
  // is. null means "this row is the viewer themselves," which gets no
  // button.
  const statuses = await Promise.all(
    friends.map((friend) => {
      if (friend.id === viewerId) {
        return Promise.resolve(null);
      }
      if (!token) {
        return Promise.resolve(FriendshipStatus.None);
      }
      return getFriendshipStatus(token, friend.id).catch(() => FriendshipStatus.None);
    }),
  );

  return (
    <div className="mx-auto py-8 lg:max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-100">Friends</h1>
      {friends.length === 0 ? (
        <p className="text-zinc-500">No friends yet.</p>
      ) : (
        <ul className="flex flex-col">
          {friends.map((friend, index) => (
            <li
              key={friend.id}
              className="flex items-center justify-between gap-3 border-b border-zinc-800 py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <UserListItem user={friend} avatarSizeClassName="h-12 w-12" />
              </div>
              {statuses[index] !== null && (
                <FriendActionButton
                  userId={friend.id}
                  initialStatus={statuses[index]}
                  className="px-3 py-1.5 text-sm"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
