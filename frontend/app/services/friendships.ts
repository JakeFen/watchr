import { backendFetch, backendUrl } from "./backendFetch";
import type { FriendshipStatus } from "../types/friendshipStatus";
import type { UserSummary } from "../types/userSummary";

// listFriendsForUser lists a user's accepted friends by their id.
// Friendships aren't private, so this hits the backend's public
// endpoint directly -- no Clerk token needed.
export async function listFriendsForUser(userID: string): Promise<UserSummary[]> {
  const response = await fetch(backendUrl(`/users/${userID}/friends`), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to list friends: ${response.status}`);
  }
  return response.json();
}

// getFriendshipStatus returns the status of any friendship (either
// direction) between the caller and userID -- FriendshipStatus.None
// if there isn't one.
export async function getFriendshipStatus(token: string, userID: string): Promise<FriendshipStatus> {
  const response = await backendFetch(token, `/users/${userID}/friendship-status`);
  if (!response.ok) {
    throw new Error(`Failed to check friendship status: ${response.status}`);
  }
  const { status }: { status: FriendshipStatus } = await response.json();
  return status;
}

export async function sendFriendRequest(token: string, userID: string): Promise<void> {
  const response = await backendFetch(token, `/users/${userID}/friends`, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Failed to send friend request: ${response.status}`);
  }
}

export async function removeFriendship(token: string, userID: string): Promise<void> {
  const response = await backendFetch(token, `/users/${userID}/friends`, { method: "DELETE" });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to remove friendship: ${response.status}`);
  }
}
