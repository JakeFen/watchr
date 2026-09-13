import type { Friend } from "../types/friend";

const BACKEND_URL = process.env.BACKEND_URL;

// listFriendsForUser lists a user's accepted friends by their id.
// Friendships aren't private, so this hits the backend's public
// endpoint directly -- no Clerk token needed.
export async function listFriendsForUser(userID: string): Promise<Friend[]> {
  const response = await fetch(`${BACKEND_URL}/users/${userID}/friends`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to list friends: ${response.status}`);
  }
  return response.json();
}
