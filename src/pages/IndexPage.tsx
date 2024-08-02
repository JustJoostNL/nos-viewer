import { Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import { JSONTree } from "react-json-tree";
import { useHotkeys } from "react-hotkeys-hook";
import { ContentLayout } from "../components/layouts/ContentLayout";
import { getBroadcasts, getVideos } from "../lib/nos/api";
import { VideoList } from "../components/nos/VideoList";
import { VideoListSkeleton } from "../components/nos/VideoListSkeleton";

enum TabCatorgory {
  SPORT_VIDEOS = "sport_videos",
  BROADCASTS = "broadcasts",
}

function tabCategoryToFetcher(tab: TabCatorgory) {
  switch (tab) {
    case TabCatorgory.BROADCASTS:
      return getBroadcasts;
    case TabCatorgory.SPORT_VIDEOS:
      return getVideos;
  }
}

export function IndexPage() {
  const [tab, setTab] = useState<TabCatorgory>(TabCatorgory.BROADCASTS);
  const [debug, setDebug] = useState(false);

  useHotkeys("d", () => setDebug((prev) => !prev));

  const fetcher = tabCategoryToFetcher(tab);

  const { data } = useSWR(
    {
      _tab: tab,
      limit: 20,
    },
    fetcher,
    {
      refreshInterval: 1000 * 30, // 30 seconds
    },
  );
  console.log(data);

  return (
    <ContentLayout title="Home">
      <Typography variant="h4" my={2} mx={2}>
        Welcome to NOS Viewer!
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="fullWidth"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Live Broadcasts" value={TabCatorgory.BROADCASTS} />
        <Tab label="Sport Videos" value={TabCatorgory.SPORT_VIDEOS} />
      </Tabs>

      {data ? <VideoList videos={data.items} /> : <VideoListSkeleton />}

      {debug && <JSONTree data={data?.items} />}
    </ContentLayout>
  );
}
