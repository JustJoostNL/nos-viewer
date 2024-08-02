import React, { FC } from "react";
import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { Root } from "./VideoList";

interface IProps {
  length?: number;
}

export const VideoListSkeleton: FC<IProps> = ({ length = 10, ...rest }) => (
  <Root {...rest}>
    {Array.from({ length }).map((_, i) => (
      <Card key={i}>
        <Skeleton
          variant="rectangular"
          sx={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
        />
        <CardContent>
          <Typography variant="h6">
            <Skeleton />
            <Skeleton width="80%" />
          </Typography>
          <Typography variant="body2">
            <Skeleton width="20%" />
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Root>
);
