import {
  Card,
  CardActionArea,
  Box,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { FormattedDateTimeRange } from "react-intl";
import { VideoItem } from "../../lib/nos/nos_types";
import { RelativeTimeAgo } from "../shared/RelativeTimeAgo";
import { VideoListItemLiveLabel } from "./VideoListItemLiveLabel";
import { VideoListItemDurationLabel } from "./VideoListItemDurationLabel";
import { timestampToUnix } from "./shared";

const fallbackImage =
  "https://static.nos.nl/img/uitzendingen/programs/nos-journaal_2048.jpg";

interface IProps {
  video: VideoItem;
}

export const VideoListItem: FC<IProps> = ({ video }) => {
  const image = video.image;

  const dateMeta = {
    start: timestampToUnix(video.start_at),
    end: timestampToUnix(video.end_at),
    date: timestampToUnix(video.date),
  };

  const imageUrl = useMemo(() => {
    if (image?.formats) {
      const sortedFormats = image.formats.sort(
        (a, b) => a.width - b.width || a.height - b.height,
      );
      return sortedFormats[sortedFormats.length - 1].url.jpg;
    }
    return fallbackImage;
  }, [image?.formats]);

  const currentYear = new Date().getFullYear();
  const displayYear =
    dateMeta.start && dateMeta.end
      ? new Date(dateMeta.start * 1000).getFullYear() !== currentYear
      : dateMeta.date
        ? new Date(dateMeta.date * 1000).getFullYear() !== currentYear
        : false;

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
            src={imageUrl}
            alt={video.title}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          <VideoListItemLiveLabel video={video} />
          <VideoListItemDurationLabel video={video} />
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
          <Typography variant="body2" color="text.secondary">
            {dateMeta.start && dateMeta.end ? (
              <FormattedDateTimeRange
                from={dateMeta.start * 1000}
                to={dateMeta.end * 1000}
                year={displayYear ? "numeric" : undefined}
                month="short"
                day="numeric"
                hour="numeric"
                minute="numeric"
              />
            ) : (
              dateMeta.date && <RelativeTimeAgo value={dateMeta.date} />
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
