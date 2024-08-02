import React, { useState } from "react";
import { JSONTree } from "react-json-tree";
import useSWR from "swr";
import { Typography } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { useConfig } from "../hooks/useConfig";
import { ContentLayout } from "../components/layouts/ContentLayout";
import { getVideoItem } from "../lib/nos/api";
import { VideoList } from "../components/nos/VideoList";
import { VideoListSkeleton } from "../components/nos/VideoListSkeleton";

async function fetchFavorites(items: number[]) {
  const data = await Promise.all(
    items.map((id) =>
      getVideoItem({ id }).catch((error) => {
        console.error("Failed to fetch favorite item", id, error);
        return null;
      }),
    ),
  );

  return data.filter((item) => item !== null);
}

export function FavoritesPage() {
  const [debug, setDebug] = useState(false);
  const { config } = useConfig();

  useHotkeys("d", () => setDebug((prev) => !prev));

  const favorites = config.favoriteItems;

  const { data } = useSWR(favorites, fetchFavorites, {
    revalidateOnFocus: false,
  });

  return (
    <ContentLayout title="Favorites">
      {data ? (
        <VideoList videos={data} />
      ) : (
        <VideoListSkeleton length={favorites.length} />
      )}

      {favorites.length === 0 && (
        <Typography variant="h4" align="center">
          No favorites yet, add some by clicking the star icon on a video
        </Typography>
      )}

      {debug && <JSONTree data={config} />}
    </ContentLayout>
  );
}
