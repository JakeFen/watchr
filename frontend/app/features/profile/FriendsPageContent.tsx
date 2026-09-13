import { listFriendsForUser } from "../../services/friendships";
import { FriendListItem } from "./FriendListItem";

export async function FriendsPageContent({ userId }: { userId: string }) {
  const friends = await listFriendsForUser(userId).catch(() => []);

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-100">Friends</h1>
      {friends.length === 0 ? (
        <p className="text-zinc-500">No friends yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {friends.map((friend) => (
            <li key={friend.id}>
              <FriendListItem friend={friend} avatarSizeClassName="h-12 w-12" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
