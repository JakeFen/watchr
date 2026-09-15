import { auth } from "@clerk/nextjs/server";
import { getFeed } from "../../services/mediaEntries";
import { getUsersByIds } from "../../services/users";
import { FeedList, PAGE_SIZE } from "./FeedList";

export async function Feed() {
  const { userId, getToken } = await auth();
  const token = userId ? await getToken() : null;
  const entries = token ? await getFeed(token, PAGE_SIZE).catch(() => []) : [];

  const actorIds = [...new Set(entries.map((entry) => entry.userId))];
  const actors = await getUsersByIds(actorIds).catch(() => []);

  if (entries.length === 0) {
    return (
      <div className="mx-auto py-8 lg:max-w-3xl">
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 p-8">
          <p className="text-sm text-zinc-500">
            No activity yet -- add some friends or start watching something!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 lg:max-w-3xl">
      <FeedList initialEntries={entries} initialActors={actors} />
    </div>
  );
}
