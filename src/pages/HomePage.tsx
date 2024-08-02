import { Box, Button, ButtonGroup, Tab, Tabs, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
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
  BROADCASTS = "broadcasts",
  SPORT_VIDEOS = "sport-videos",
  NEWS_VIDEOS = "news-videos",
  F1_VIDEOS = "f1-videos",
  OLYMPIC_VIDEOS = "olympic-videos",
}

function tabCategoryToFetcher(tab: TabCatorgory) {
  switch (tab) {
    case TabCatorgory.BROADCASTS:
      return {
        function: getBroadcasts,
        args: {},
      };
    case TabCatorgory.SPORT_VIDEOS:
      return {
        function: getVideoItems,
        args: {
          mainCategory: MainCategory.SPORT,
          type: SubCategory.VIDEO,
        },
      };
    case TabCatorgory.NEWS_VIDEOS:
      return {
        function: getVideoItems,
        args: {
          mainCategory: MainCategory.NEWS,
          type: SubCategory.VIDEO,
        },
      };
    case TabCatorgory.OLYMPIC_VIDEOS:
      return {
        function: getVideoItems,
        args: {
          systemTag: "os-2024",
          type: SubCategory.VIDEO,
        },
      };
    case TabCatorgory.F1_VIDEOS:
      return {
        function: getVideoItems,
        args: {
          subCategory: "formule-1",
        },
      };
  }
}

const MAX_LIMIT = 100;

export function HomePage() {
  const [tab, setTab] = useState<TabCatorgory>(TabCatorgory.BROADCASTS);
  const [limit, setLimit] = useState(20);
  const [debug, setDebug] = useState(false);

  useHotkeys("d", () => setDebug((prev) => !prev));

  const fetcher = tabCategoryToFetcher(tab);

  const { data } = useSWR(
    {
      key: tab.toString(),
      limit,
      ...fetcher.args,
    },
    fetcher.function,
    {
      refreshInterval: 1000 * 30, // 30 seconds
    },
  );

  const handleChangeLimit = useCallback((type: "increment" | "decrement") => {
    setLimit((prev) => {
      if (type === "increment") return prev + 20;
      return prev - 20;
    });
  }, []);

  useEffect(() => {
    setLimit(20);
  }, [tab]);

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
        <Tab label="Live Broadcasts" value="broadcasts" />
        <Tab label="Sport Videos" value="sport-videos" />
        <Tab label="Olympic Videos" value="olympic-videos" />
        <Tab label="F1 Videos" value="f1-videos" />
        <Tab label="News Videos" value="news-videos" />
      </Tabs>

      {data ? <VideoList videos={data.items} /> : <VideoListSkeleton />}

      <Box display="flex" justifyContent="center" my={4}>
        <ButtonGroup>
          <Button
            disabled={limit <= 20}
            onClick={() => handleChangeLimit("decrement")}
          >
            Load Less
          </Button>
          <Button
            disabled={limit >= MAX_LIMIT || (data?.items?.length ?? 0) < limit}
            onClick={() => handleChangeLimit("increment")}
          >
            Load More
          </Button>
        </ButtonGroup>
      </Box>

      {debug && <JSONTree data={{ items: data?.items }} />}
    </ContentLayout>
  );
}
