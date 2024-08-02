import React, { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/system";
import { check, Update } from "@tauri-apps/plugin-updater";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { ErrorOutlineRounded } from "@mui/icons-material";
import { CircularProgress, Typography, Stack, Button } from "@mui/material";
import { theme } from "../lib/theme";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  gap: theme.spacing(2),
});

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  padding: theme.spacing(2),
  gap: theme.spacing(4),
});

export function IndexPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<Update | null>(null);
  const [doneChecking, setDoneChecking] = useState(false);
  const [updateError, setUpdateError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const updateResult = await check();
        const isAvailable = Boolean(updateResult?.available);
        setUpdateResult(updateResult);
        setUpdating(isAvailable);
        setDoneChecking(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setDoneChecking(true);
      }
    })();
  }, []);

  useEffect(() => {
    if ((!updating && !doneChecking) || !updateResult) return;

    (async () => {
      await updateResult?.downloadAndInstall().catch(() => {
        setUpdateError(true);
      });
    })();
  }, [updating, doneChecking, updateResult]);

  const handleContinue = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  useHotkeys("shift+s", handleContinue);

  useEffect(() => {
    if (!updating && doneChecking) {
      setLoading(false);
      if (!updateError) navigate("/home");
    }
  }, [updating, doneChecking, navigate, updateError]);

  return (
    <Container>
      <Content>
        {!updateError && <CircularProgress />}
        {updateError && <ErrorOutlineRounded color="warning" />}
        <Typography>
          {loading || !doneChecking
            ? "Checking for updates..."
            : updating
              ? "Installing update..."
              : updateError
                ? "Failed to automatically update, please download the latest version manually."
                : ""}
        </Typography>
        {!updating && updateError && (
          <Stack direction="row" gap={2}>
            <Button onClick={handleContinue}>
              Continue with outdated version
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/JustJoostNL/nos-viewer/releases/latest"
            >
              Download update
            </Button>
          </Stack>
        )}
        {updating && (
          <Button onClick={handleContinue} sx={{ mt: 2 }}>
            Skip checking for updates
          </Button>
        )}
      </Content>
    </Container>
  );
}
