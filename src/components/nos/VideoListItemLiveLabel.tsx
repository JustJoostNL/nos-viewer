import React, { FC } from "react";
import { styled } from "@mui/material";
import { VideoItem } from "../../lib/nos/nos_types";
import { timestampToUnix } from "./shared";

const LiveLabel = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(0.5),
  left: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
  letterSpacing: 0.5,
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.spacing(0.5),
  backdropFilter: "blur(4px)",
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IProps {
  video: VideoItem;
}

export const VideoListItemLiveLabel: FC<IProps> = ({ video }) => {
  const startUnix = timestampToUnix(video.start_at);
  const endUnix = timestampToUnix(video.end_at);

  const isScheduledToBeLive =
    startUnix &&
    endUnix &&
    startUnix <= Math.floor(Date.now() / 1000) &&
    endUnix >= Math.floor(Date.now() / 1000);

  if (!isScheduledToBeLive) return null;

  return <LiveLabel>LIVE</LiveLabel>;
};
