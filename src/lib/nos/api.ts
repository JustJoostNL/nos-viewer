import { IVideoItemsResponse } from "./nos_types";

const liveAndBoradcastUrl =
  "https://api.jstt.me/api/v2/nos/nosapp/v4/livestreams-and-broadcasts";
const videoUrl =
  "https://api.jstt.me/api/v2/nos/nosapp/v4/items?mainCateogries[0]=sport&types[0]=video";

export class NosApiError extends Error {
  constructor(
    message: string,
    public readonly response: Response,
  ) {
    super(message);

    this.name = "NosApiError";
  }
}

export async function getBroadcasts(): Promise<IVideoItemsResponse> {
  const response = await fetch(liveAndBoradcastUrl);

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch livestreams and broadcasts: ${await response.text()}`,
      response,
    );
  }

  const data = await response.json();

  return data;
}

export async function getVideos({
  limit,
  lastItemId,
}: {
  limit: string | number;
  lastItemId?: number;
}): Promise<IVideoItemsResponse> {
  const url = new URL(videoUrl);
  url.searchParams.set("limit", limit.toString());
  if (lastItemId) url.searchParams.set("before", lastItemId.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch videos: ${await response.text()}`,
      response,
    );
  }

  const json = await response.json();
  return json;
}
