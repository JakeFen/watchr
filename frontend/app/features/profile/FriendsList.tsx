import { auth } from "@clerk/nextjs/server";
import { Button } from "../../components/Button";
import { UserListItem } from "../../components/UserListItem";
import { listFriendsForUser, listPendingFriendRequests } from "../../services/friendships";
import { getUsersByIds } from "../../services/users";
import { ButtonVariant } from "../../types/button";
import { FriendRequestActions } from "./FriendRequestActions";

const PREVIEW_COUNT = 5;
const MAX_DISPLAYED_COUNT = 500;

export async function FriendsList({ userId }: { userId: string }) {
  const { userId: viewerId, getToken } = await auth();
  const isOwnProfile = viewerId === userId;

  const friends = await listFriendsForUser(userId)
    .then(getUsersByIds)
    .catch(() => []);
  const countLabel =
    friends.length > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : friends.length;

  const token = isOwnProfile ? await getToken() : null;
  const pendingRequests = token
    ? await listPendingFriendRequests(token, userId)
        .then(getUsersByIds)
        .catch(() => [])
    : [];

  return (
    <div className="order-first w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 lg:order-last">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-zinc-100">Friends</h2>
        <span className="text-sm text-zinc-300">{countLabel}</span>
      </div>

      {friends.length === 0 ? (
        <p className="text-sm text-zinc-500">No friends yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {friends.slice(0, PREVIEW_COUNT).map((friend) => (
            <li key={friend.id}>
              <UserListItem user={friend} />
            </li>
          ))}
        </ul>
      )}

      <Button
        href={`/users/${userId}/friends`}
        variant={ButtonVariant.Secondary}
        className="mt-4 block w-full py-1.5 text-center text-sm"
      >
        View All
      </Button>

      {pendingRequests.length > 0 && (
        <div className="mt-4 border-t border-zinc-700 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-100">Pending Requests</h3>
          <ul className="flex flex-col gap-3">
            {pendingRequests.map((request) => (
              <li key={request.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <UserListItem user={request} />
                </div>
                <FriendRequestActions userId={request.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
