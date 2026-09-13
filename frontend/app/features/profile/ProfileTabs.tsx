"use client";

import { useState } from "react";
import { Chip } from "../../components/Chip";
import { WatchStatus } from "../../types/media";
import type { MediaEntry } from "../../types/mediaEntry";
import { ProfileTab } from "../../types/profileTab";
import { RecentActivitiesTab } from "./RecentActivitiesTab";
import { WatchedTab } from "./WatchedTab";
import { WatchingTab } from "./WatchingTab";
import { WantToWatchTab } from "./WantToWatchTab";

const TAB_LABEL: Record<ProfileTab, string> = {
  [ProfileTab.RecentActivity]: "Recent Activities",
  [ProfileTab.Watched]: "Watched",
  [ProfileTab.Watching]: "Watching",
  [ProfileTab.WantToWatch]: "Want to Watch",
};

const TAB_STATUS: Partial<Record<ProfileTab, WatchStatus>> = {
  [ProfileTab.Watched]: WatchStatus.Watched,
  [ProfileTab.Watching]: WatchStatus.Watching,
  [ProfileTab.WantToWatch]: WatchStatus.WantToWatch,
};

export function ProfileTabs({ entries }: { entries: MediaEntry[] }) {
  const [tab, setTab] = useState<ProfileTab>(ProfileTab.RecentActivity);

  const tabs = Object.values(ProfileTab).map((value) => {
    const status = TAB_STATUS[value];
    const count = status
      ? entries.filter((entry) => entry.status === status).length
      : entries.length;
    return { label: `${TAB_LABEL[value]} (${count})`, value };
  });

  return (
    <section>
      <Chip options={tabs} value={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === ProfileTab.RecentActivity && <RecentActivitiesTab entries={entries} />}
        {tab === ProfileTab.Watched && <WatchedTab entries={entries} />}
        {tab === ProfileTab.Watching && <WatchingTab entries={entries} />}
        {tab === ProfileTab.WantToWatch && <WantToWatchTab entries={entries} />}
      </div>
    </section>
  );
}
