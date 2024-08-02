import {
  Card,
  CardActionArea,
  Box,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { FC, useCallback, useMemo } from "react";
import { FormattedDateTimeRange } from "react-intl";
import { StarOutline, StarRounded } from "@mui/icons-material";
import { yellow } from "@mui/material/colors";
import { VideoItem } from "../../lib/nos/nos_types";
import { RelativeTimeAgo } from "../shared/RelativeTimeAgo";
import { createWindow } from "../../lib/utils/createWindow";
import { useConfig } from "../../hooks/useConfig";
import { VideoListItemLiveLabel } from "./VideoListItemLiveLabel";
import { VideoListItemDurationLabel } from "./VideoListItemDurationLabel";
import { timestampToUnix } from "./shared";

const fallbackImage =
  "https://static.nos.nl/img/uitzendingen/programs/nos-journaal_2048.jpg";

interface IProps {
  video: VideoItem;
}

export const VideoListItem: FC<IProps> = ({ video }) => {
  const { config, updateConfig } = useConfig();

  const isFavorite = config.favoriteItems?.includes(video.id);
  const isFavoritable = video.type !== "broadcast";

  const image = video.image;

  const dateMeta = {
    start: timestampToUnix(video.start_at),
    end: timestampToUnix(video.end_at),
    date: timestampToUnix(video.date),
    published_at: timestampToUnix(video.published_at),
  };

  const publishDate = dateMeta.published_at ?? dateMeta.date;

  const imageUrl = useMemo(() => {
    if (image?.formats) {
      const sortedFormats = image.formats.sort(
        (a, b) => a.width - b.width || a.height - b.height,
      );
      return sortedFormats[sortedFormats.length - 1].url.jpg;
    }
    return fallbackImage;
  }, [image?.formats]);

  const handleItemClick = useCallback(() => {
    createWindow(
      `player-${video.id}`,
      video.title,
      `#/player/${encodeURIComponent(video.id)}`,
    );
  }, [video]);

  const handleFavoriteClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent item click

      const favorites = config.favoriteItems ?? [];
      const isFavorite = favorites.includes(video.id);

      if (isFavorite) {
        updateConfig({
          favoriteItems: favorites.filter((id) => id !== video.id),
        });
      } else {
        updateConfig({ favoriteItems: [...favorites, video.id] });
      }
    },
    [config.favoriteItems, updateConfig, video.id],
  );

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
        onClick={handleItemClick}
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
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
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

            {isFavoritable && (
              <Tooltip
                arrow
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <IconButton onClick={handleFavoriteClick}>
                  {isFavorite ? (
                    <StarRounded sx={{ color: yellow[700] }} />
                  ) : (
                    <StarOutline />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
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
              publishDate && <RelativeTimeAgo value={publishDate} />
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
