import React, { FC, useCallback } from "react";
import { styled } from "@mui/material";
import { cardClasses } from "@mui/material/Card";
import { VideoItem } from "../../lib/nos/nos_types";
import { timestampToUnix } from "./shared";

const DurationLabel = styled("span")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(0.5),
  right: theme.spacing(0.5),
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: theme.palette.common.white,
  fontSize: theme.typography.pxToRem(12),
  fontWeight: "bold",
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.spacing(0.5),
  backdropFilter: "blur(4px)",
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  [`.${cardClasses.root}:hover &`]: {
    opacity: 0,
  },
}));

interface IProps {
  video: VideoItem;
}

export const VideoListItemDurationLabel: FC<IProps> = ({ video }) => {
  const videoDuration = video.duration;
  const startAt = timestampToUnix(video.start_at);
  const endAt = timestampToUnix(video.end_at);

  const formatVideoDuration = useCallback((duration: number) => {
    const dateObj = new Date(duration * 1000);
    return duration >= 3600
      ? dateObj.toISOString().slice(11, 19)
      : dateObj.toISOString().slice(14, 19);
  }, []);

  const formatDurationBetweenDates = useCallback(
    (start: number, end: number) => {
      const startDate = new Date(start * 1000);
      const endDate = new Date(end * 1000);
      const duration = (endDate.getTime() - startDate.getTime()) / 1000;
      return formatVideoDuration(duration);
    },
    [formatVideoDuration],
  );

  const durationLabel = videoDuration
    ? formatVideoDuration(videoDuration)
    : startAt && endAt
      ? formatDurationBetweenDates(startAt, endAt)
      : undefined;

  if (!durationLabel) return null;

  return <DurationLabel>{durationLabel}</DurationLabel>;
};
