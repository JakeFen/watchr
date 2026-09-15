import { clerkClient } from "@clerk/nextjs/server";
import type { UserSummary } from "../types/userSummary";

// searchUsers finds users whose username contains query (case
// insensitive, partial match). Clerk's list API only supports a
// broader "query" that also matches email, phone, and name -- results
// are filtered down to username matches only afterward, since letting
// someone search up an account by another user's email isn't
// something we want to expose.
export async function searchUsers(query: string): Promise<UserSummary[]> {
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ query, limit: 20 });
  const needle = query.toLowerCase();

  return data
    .filter((user) => user.username?.toLowerCase().includes(needle))
    .map((user) => ({ id: user.id, username: user.username }));
}
