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
  const [loaded, setLoaded] = useState(false);

  const { data } = useSWR({ id }, getVideoItem, {
    revalidateOnFocus: false,
  });

  const manifestUri = useMemo(() => {
    const format = data?.formats?.find?.(
      (fm) =>
        (fm.width === 1280 && fm.height === 720) || fm?.name === "adaptive",
    );
    return format?.url.dash || format?.url.hls || format?.url.mp4;
  }, [data]);
  console.log(manifestUri);

  const currentSlug = useMemo(() => `player-${id}`, [id]);

  useEffect(() => {
    if (!manifestUri || !videoElement.current || !uiContainer.current) return;

    const player = new shaka.Player(videoElement.current);
    shakaPlayer.current = player;
    player.configure({
      streaming: {
        bufferBehind: 30, // 30 seconds of content will be buffered behind the playhead
        liveSync: {
          targetLatency: 30,
        },
        retryParameters: {
          timeout: 30_000, // timeout in ms, after which we abort; 0 means never
          maxAttempts: 128, // the maximum number of requests before we fail
          baseDelay: 1000, // the base delay in ms between retries
          backoffFactor: 4, // the multiplicative backoff factor between retries
          fuzzFactor: 0.5, // the fuzz factor to apply to each retry delay
        },
      },
    });

    const ui = new shaka.ui.Overlay(
      player,
      uiContainer.current,
      videoElement.current,
    );
    ui.configure({
      overflowMenuButtons: [
        "captions",
        "quality",
        "language",
        "picture_in_picture",
        "cast",
        "playback_rate",
        "statistics",
      ],
      singleClickForPlayAndPause: false,
      doubleClickForFullscreen: false,
      enableKeyboardPlaybackControls: false,
    });

    player.addEventListener("error", (event) => {
      console.log(event);
    });

    (async () => {
      try {
        await player.load(manifestUri);
        setLoaded(true);
      } catch (error: any) {
        console.error("Error code", error.code, "object", error);
      }
    })();
  }, [manifestUri, currentSlug]);

  if (data && !manifestUri) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography variant="h4">
          Sorry, this video is not available. Please try another one.
        </Typography>
      </Box>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {!loaded && (
        <Box
          sx={{
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
      )}
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
    </div>
  );
}
