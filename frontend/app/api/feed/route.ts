import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFeed } from "../../services/mediaEntries";
import { getUsersByIds } from "../../services/users";

// GET /api/feed?limit=&offset= backs the feed's "View More" button --
// FeedList (a client component) can't call getFeed/getUsersByIds
// directly, since both need server-only Clerk clients, so it fetches
// this route for each additional page instead.
export async function GET(request: Request) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || undefined;
  const offset = Number(searchParams.get("offset")) || undefined;

  const entries = await getFeed(token, limit, offset);
  const actorIds = [...new Set(entries.map((entry) => entry.userId))];
  const actors = await getUsersByIds(actorIds).catch(() => []);

  return NextResponse.json({ entries, actors });
}
