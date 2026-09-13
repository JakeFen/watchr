import { listMediaEntriesForUser } from "../../services/mediaEntries";
import { ProfileTabs } from "./ProfileTabs";

export async function ProfileTabsContent({ userId }: { userId: string }) {
  const entries = await listMediaEntriesForUser(userId).catch(() => []);

  return <ProfileTabs entries={entries} />;
}
