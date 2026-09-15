import { Button } from "../../components/Button";
import { UserListItem } from "../../components/UserListItem";
import { listFriendsForUser } from "../../services/friendships";
import { ButtonVariant } from "../../types/button";

const PREVIEW_COUNT = 5;
const MAX_DISPLAYED_COUNT = 500;

export async function FriendsList({ userId }: { userId: string }) {
  const friends = await listFriendsForUser(userId).catch(() => []);
  const countLabel =
    friends.length > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : friends.length;

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
    </div>
  );
}
