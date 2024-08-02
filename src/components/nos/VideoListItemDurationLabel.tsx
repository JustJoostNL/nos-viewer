import React, { FC, useCallback } from "react";
import { styled } from "@mui/material";
import { cardClasses } from "@mui/material/Card";
import { LiveItem } from "../../lib/nos/nos_types";

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
  video: LiveItem;
}

export const VideoListItemDurationLabel: FC<IProps> = ({ video }) => {
  const formatDuration = useCallback((seconds: number) => {
    const dateObj = new Date(seconds * 1000);
    return seconds >= 3600
      ? dateObj.toISOString().slice(11, 19)
      : dateObj.toISOString().slice(14, 19);
  }, []);

  const durationLabel = video.duration
    ? formatDuration(video.duration)
    : undefined;

  if (!durationLabel) return null;

  return <DurationLabel>{durationLabel}</DurationLabel>;
};
