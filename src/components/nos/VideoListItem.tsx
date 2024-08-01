import {
  styled,
  Card,
  CardActionArea,
  Box,
  CardMedia,
  CardContent,
  Typography,
  cardClasses,
} from "@mui/material";
import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { LiveItem } from "../../lib/nos/nos_types";
import { RelativeTimeAgo } from "../shared/RelativeTimeAgo";

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

export const VideoListItem: FC<IProps> = ({ video }) => {
  const date = video.start_at ?? video.date;

  const publishedAtUnix = useMemo(
    () => (date ? Math.floor(new Date(date).getTime() / 1000) : undefined),
    [date],
  );

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={`/nos/videos/${encodeURIComponent(video.id)}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Box
          position="relative"
          sx={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
        >
          <CardMedia
            component="img"
            src={video.image?.formats[video.image?.formats.length - 1].url.jpg}
            alt={video.title}
          />
          <DurationLabel>{video.duration}</DurationLabel>
        </Box>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              display: "-webkit-box",
            }}
            title={video.description}
          >
            {video.title}
          </Typography>
          {publishedAtUnix && (
            <Typography variant="body2" color="text.secondary">
              <RelativeTimeAgo value={publishedAtUnix} />
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
