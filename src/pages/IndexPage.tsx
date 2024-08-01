import { Typography } from "@mui/material";
import React from "react";
import useSWR from "swr";
import { JSONTree } from "react-json-tree";
import { ContentLayout } from "../components/layouts/ContentLayout";
import { getLivestreamsAndBroadcasts } from "../lib/nos/api";
import { VideoList } from "../components/nos/VideoList";

export function IndexPage() {
  const { data } = useSWR("nos", getLivestreamsAndBroadcasts);

  return (
    <ContentLayout title="Home">
      <Typography variant="h4" my={2} mx={2}>
        Welcome to NOS Viewer!
      </Typography>

      {data && <VideoList videos={data.items} />}

      <JSONTree data={data?.items} />
    </ContentLayout>
  );
}
