import React, { useMemo } from "react";
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

export const VideoList = ({ videos }: IProps) => {
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (
        video.type === "broadcast" &&
        "date" in video &&
        "duration" in video &&
        video.date &&
        video.duration
      ) {
        const startTime = new Date(video.date).getTime();
        const endTime = startTime + video.duration * 1000;
        const now = Date.now();
        return startTime < now && now < endTime;
      }
      return true;
    });
  }, [videos]);

  return (
    <Root>
      {filteredVideos.map((video) => (
        <VideoListItem key={video.id} video={video} />
      ))}
    </Root>
  );
};
