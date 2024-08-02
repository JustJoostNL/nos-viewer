import { Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { JSONTree } from "react-json-tree";
import { useHotkeys } from "react-hotkeys-hook";
import { ContentLayout } from "../components/layouts/ContentLayout";
import {
  getBroadcasts,
  getVideoItems,
  MainCategory,
  SubCategory,
} from "../lib/nos/api";
import { VideoList } from "../components/nos/VideoList";
import { VideoListSkeleton } from "../components/nos/VideoListSkeleton";

enum TabCatorgory {
  VIDEOS = "videos",
  BROADCASTS = "broadcasts",
}

function tabCategoryToFetcher(
  tab: TabCatorgory,
  mainCategory: MainCategory,
  subCategory: SubCategory,
) {
  switch (tab) {
    case TabCatorgory.BROADCASTS:
      return {
        function: getBroadcasts,
        args: {},
      };
    case TabCatorgory.VIDEOS:
      return {
        function: getVideoItems,
        args: { mainCategory, subCategory },
      };
  }
}

export function IndexPage() {
  const [mainCategory, setMainCategory] = useState<MainCategory>(
    MainCategory.SPORT,
  );
  const [subCategory, setSubCategory] = useState<SubCategory>(
    SubCategory.VIDEO,
  );
  const [tab, setTab] = useState<TabCatorgory>(TabCatorgory.BROADCASTS);
  const [lastItemId, setLastItemId] = useState<number | undefined>(undefined);
  const [debug, setDebug] = useState(false);

  useHotkeys("d", () => setDebug((prev) => !prev));

  const fetcher = tabCategoryToFetcher(tab, mainCategory, subCategory);

  const { data, mutate } = useSWR(
    {
      key: tab.toString(),
      ...fetcher.args,
    },
    fetcher.function,
    {
      refreshInterval: 1000 * 30, // 30 seconds
    },
  );

  useEffect(() => {
    if (!data) return;

    const lastItem = data.items[data.items.length - 1];
    setLastItemId(lastItem.id);
  }, [data]);

  return (
    <ContentLayout title="Home">
      <Typography variant="h4" my={2} mx={2}>
        Welcome to NOS Viewer!
      </Typography>

      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Main Category:</Typography>
        <Tabs
          value={mainCategory}
          onChange={(_, value) => setMainCategory(value)}
        >
          <Tab label="Sport" value={MainCategory.SPORT} />
          <Tab label="News" value={MainCategory.NEWS} />
        </Tabs>

        <Typography variant="h6">Sub Category:</Typography>
        <Tabs
          value={subCategory}
          onChange={(_, value) => setSubCategory(value)}
        >
          <Tab label="Video" value={SubCategory.VIDEO} />
          <Tab label="Livestream" value={SubCategory.LIVESTREAM} />
        </Tabs>
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="fullWidth"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Live Broadcasts" value="broadcasts" />
        <Tab label="Videos" value="videos" />
      </Tabs>

      {data ? <VideoList videos={data.items} /> : <VideoListSkeleton />}

      {debug && <JSONTree data={{ items: data?.items, lastItemId }} />}
    </ContentLayout>
  );
}
