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
  SPORTS = "sports",
  NEWS = "news",
  FORMULA1 = "formula1",
  OLYMPICS = "olympics",
  SOCCER = "soccer",
  CYCLING = "cycling",
  ICE_SKATING = "ice-skating",
  TENNIS = "tennis",
}

const tabCategoryToArgs: Record<TabCatorgory, any> = {
  [TabCatorgory.BROADCASTS]: {},
  [TabCatorgory.SPORTS]: {
    mainCategory: MainCategory.SPORT,
    type: SubCategory.VIDEO,
  },
  [TabCatorgory.NEWS]: {
    mainCategory: MainCategory.NEWS,
    type: SubCategory.VIDEO,
  },
  [TabCatorgory.OLYMPICS]: {
    systemTag: "os-2024",
    type: SubCategory.VIDEO,
  },
  [TabCatorgory.FORMULA1]: {
    subCategory: "formule-1",
  },
  [TabCatorgory.SOCCER]: {
    subCategory: "voetbal",
  },
  [TabCatorgory.CYCLING]: {
    subCategory: "wielrennen",
  },
  [TabCatorgory.ICE_SKATING]: {
    subCategory: "schaatsen",
  },
  [TabCatorgory.TENNIS]: {
    subCategory: "tennis",
  },
};

const MAX_LIMIT = 100;

export function HomePage() {
  const [tab, setTab] = useState<TabCatorgory>(TabCatorgory.BROADCASTS);
  const [limit, setLimit] = useState(20);
  const [debug, setDebug] = useState(false);

  useHotkeys("d", () => setDebug((prev) => !prev));

  const { data, error } = useSWR(
    {
      key: tab.toString(),
      limit,
      ...tabCategoryToArgs[tab],
    },
    tab === TabCatorgory.BROADCASTS ? getBroadcasts : getVideoItems,
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

  if (error) {
    return (
      <ContentLayout title="Home">
        <Typography variant="h4" my={2} mx={2}>
          Failed to fetch data: {error.message}
        </Typography>
      </ContentLayout>
    );
  }

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
        <Tab label="Sports" value="sports" />
        <Tab label="Olympics" value="olympics" />
        <Tab label="Formula 1" value="formula1" />
        <Tab label="News" value="news" />
        <Tab label="Soccer" value="soccer" />
        <Tab label="Cycling" value="cycling" />
        <Tab label="Ice Skating" value="ice-skating" />
        <Tab label="Tennis" value="tennis" />
      </Tabs>

      {data?.items ? <VideoList videos={data.items} /> : <VideoListSkeleton />}

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
