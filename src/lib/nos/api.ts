import { InvidualVideoItem, IVideoItemsResponse } from "./nos_types";

const liveAndBoradcastUrl =
  "https://api.jstt.me/api/v2/nos/nosapp/v4/livestreams-and-broadcasts";
const videoUrl =
  "https://api.jstt.me/api/v2/nos/nosapp/v4/items?types[0]=video";

export enum MainCategory {
  SPORT = "sport",
  NEWS = "nieuws",
}

export enum SubCategory {
  VIDEO = "video",
  LIVESTREAM = "livestream",
}

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

  const json = await response.json();

  return json;
}

export async function getVideoItems({
  limit = 20,
  mainCategory,
  subCategory,
  type,
  systemTag,
  lastItemId,
}: {
  limit?: string | number;
  mainCategory?: MainCategory;
  subCategory?: string;
  type?: SubCategory;
  systemTag?: string;
  lastItemId?: number;
}): Promise<IVideoItemsResponse> {
  const url = new URL(videoUrl);

  url.searchParams.set("limit", limit.toString());
  if (lastItemId) url.searchParams.set("before", lastItemId.toString());
  if (systemTag) url.searchParams.set("systemTag", systemTag);
  if (mainCategory) url.searchParams.set("mainCategories[0]", mainCategory);
  if (subCategory) url.searchParams.set("subCategories[0]", subCategory);
  if (type) url.searchParams.set("types[0]", type);

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

export async function getVideoItem({
  id,
}: {
  id: number;
}): Promise<InvidualVideoItem> {
  const itemUrl = `https://api.jstt.me/api/v2/nos/nosapp/v4/items/${id}`;

  const response = await fetch(itemUrl);

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch video item: ${await response.text()}`,
      response,
    );
  }

  const json = await response.json();
  return json;
}
