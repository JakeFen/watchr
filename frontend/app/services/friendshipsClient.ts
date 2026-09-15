export async function sendFriendRequest(userId: string): Promise<void> {
  const response = await fetch(`/api/friendships/${userId}`, { method: "POST" });
  // 409 means a friendship already exists -- from this button's point
  // of view that's the outcome it wanted anyway, not a failure.
  if (!response.ok && response.status !== 409) {
    throw new Error("Failed to send friend request");
  }
}

export async function acceptFriendRequest(userId: string): Promise<void> {
  const response = await fetch(`/api/friendships/${userId}`, { method: "PATCH" });
  if (!response.ok) {
    throw new Error("Failed to accept friend request");
  }
}

export async function removeFriendship(userId: string): Promise<void> {
  const response = await fetch(`/api/friendships/${userId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to remove friendship");
  }
}
