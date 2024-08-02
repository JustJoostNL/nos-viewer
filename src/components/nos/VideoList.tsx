import React from "react";
import { styled } from "@mui/system";
import { InvidualVideoItem, VideoItem } from "../../lib/nos/nos_types";
import { VideoListItem } from "./VideoListItem";

export const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gridGap: theme.spacing(2),
  margin: theme.spacing(2),
}));

interface IProps {
  videos: VideoItem[] | InvidualVideoItem[];
}

export const VideoList = ({ videos }: IProps) => (
  <Root>
    {videos.map((video) => (
      <VideoListItem key={video.id} video={video} />
    ))}
  </Root>
);
