import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getVideoItem } from "../lib/nos/api";

export function Player() {
  const { id } = useParams<{ id: string }>();
  const videoElement = useRef<HTMLVideoElement>(null);
  const shakaPlayer = useRef<shaka.Player | undefined>(undefined);
  const uiContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useSWR({ id }, getVideoItem, {
    revalidateOnFocus: false,
  });

  const manifestUri = useMemo(() => {
    const format = data?.formats.find(
      (fm) => fm.width === 1280 && fm.height === 720,
    );
    return format?.url.dash || format?.url.hls || format?.url.mp4;
  }, [data]);
  console.log(manifestUri);

  const currentSlug = useMemo(() => `player-${id}`, [id]);
  console.log(currentSlug);

  useEffect(() => {
    if (!manifestUri || !videoElement.current || !uiContainer.current) return;

    const player = new shaka.Player(videoElement.current);
    shakaPlayer.current = player;

    const ui = new shaka.ui.Overlay(
      player,
      uiContainer.current,
      videoElement.current,
    );
    ui.getControls();
    ui.configure({
      overflowMenuButtons: ["quality", "captions", "language"],
    });

    player.addEventListener("error", (event) => {
      console.log(event);
    });

    // Try to load a manifest.
    // This is an asynchronous process
    player
      .load(manifestUri)
      .then(() => {
        console.log("The video has now been loaded!");
      })
      .catch((error) => {
        console.error("Error code", error.code, "object", error);
      });
  }, [manifestUri, currentSlug]);

  if (isLoading || loading || !data) {
    return (
      <Box
        sx={{
          // position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#1c1c1c",
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {data ? data.title : "Loading..."}
        </Typography>
      </Box>
    );
  }

  return (
    <div
      id="video-container"
      style={{
        zIndex: 2,
        height: "100%",
        width: "100%",
      }}
      ref={uiContainer}
    >
      <video
        data-shaka-player
        ref={videoElement}
        autoPlay
        muted
        style={{
          zIndex: 1,
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
