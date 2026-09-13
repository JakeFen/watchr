const BACKEND_URL = process.env.BACKEND_URL;

// getMyUserId resolves the caller's Clerk token to their internal
// users.id -- the id everything else (like listMediaEntriesForUser) is
// keyed by. This is the one place a Clerk token is needed for reading
// media entries; once resolved, the rest of the read side is public.
export async function getMyUserId(token: string): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/users/self`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to resolve current user: ${response.status}`);
  }
  const { id }: { id: string } = await response.json();
  return id;
}
