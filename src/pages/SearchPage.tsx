import React, { useState } from "react";
import useSWR from "swr";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { JSONTree } from "react-json-tree";
import { ContentLayout } from "../components/layouts/ContentLayout";
import { getSearchResults } from "../lib/nos/api";
import { VideoList } from "../components/nos/VideoList";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [debug, setDebug] = useState(false);

  useHotkeys("d", () => setDebug((prev) => !prev));

  const { data, error } = useSWR(
    query.length >= 2 ? { query } : undefined,
    getSearchResults,
  );

  const isLoading = !data && query.length >= 2;
  const hasNoResults = data?.items.length === 0;

  return (
    <ContentLayout title="Search">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          label="Search content"
          variant="outlined"
          margin="normal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ width: "50%" }}
        />

        {(query.length < 2 || error) && (
          <Typography variant="caption" color="grey">
            {query.length < 2
              ? "Please enter at least 2 characters to search."
              : "Error fetching search results: " + error.message}
          </Typography>
        )}
        {isLoading && <CircularProgress sx={{ mt: 10 }} />}

        {data?.items && (
          <Box sx={{ mt: 2, width: "80%" }}>
            <VideoList videos={data.items} />
          </Box>
        )}

        {hasNoResults && (
          <Typography variant="caption" color="grey">
            No results found.
          </Typography>
        )}
      </Box>
      {debug && <JSONTree data={{ query, data, error }} />}
    </ContentLayout>
  );
}
