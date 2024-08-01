import { Box, Switch, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { JSONTree } from "react-json-tree";
import { useConfig } from "../hooks/useConfig";

export function IndexPage() {
  const { config, updateConfig } = useConfig();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateConfig({ test: event.target.checked });
    },
    [updateConfig],
  );

  return (
    <Box>
      <Typography variant="h1">Hey, welcome!</Typography>
      <Switch checked={config.test} onChange={handleChange} />
      <JSONTree data={config} />
    </Box>
  );
}
