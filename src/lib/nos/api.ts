import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import { InvidualVideoItem, IVideoItemsResponse } from "./nos_types";

const liveAndBoradcastUrl =
  "https://api.nos.nl/nosapp/v4/livestreams-and-broadcasts";
const videoUrl = "https://api.nos.nl/nosapp/v4/items?types[0]=video";

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

async function generateXNosHeader(): Promise<string> {
  const salt = Math.floor(Date.now() / 1000);
  const userAgent = `nos;${salt};Google/Nexus;Android/6.0;nl.nos.app/5.1.1`;
  const stringToHash = `;UB}7Gaji==JPHtjX3@c${userAgent}`;
  const md5HashHex = CryptoJS.MD5(stringToHash).toString(CryptoJS.enc.Hex);

  const xnos = md5HashHex + Buffer.from(userAgent).toString("base64");
  return xnos;
}

export async function getBroadcasts(): Promise<IVideoItemsResponse> {
  const xNos = await generateXNosHeader();
  const headers = new Headers({
    "x-nos": xNos,
  });

  const response = await fetch(liveAndBoradcastUrl, { headers });

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

  const xNos = await generateXNosHeader();
  const headers = new Headers({
    "x-nos": xNos,
  });
  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch videos: ${await response.text()}`,
      response,
    );
  }

  const json = await response.json();
  return json;
}

export async function getSearchResults({
  query,
}: {
  query: string;
}): Promise<IVideoItemsResponse> {
  const searchUrl = "https://api.nos.nl/nosapp/v4/search";
  const url = new URL(searchUrl);

  url.searchParams.set("q", query);
  url.searchParams.set("type[0]", "video");

  const xNos = await generateXNosHeader();
  const headers = new Headers({
    "x-nos": xNos,
  });

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch search results: ${await response.text()}`,
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
  const itemUrl = `https://api.nos.nl/nosapp/v4/items/${id}`;

  const xNos = await generateXNosHeader();
  const headers = new Headers({
    "x-nos": xNos,
  });

  const response = await fetch(itemUrl, { headers });

  if (!response.ok) {
    throw new NosApiError(
      `Failed to fetch video item: ${await response.text()}`,
      response,
    );
  }

  const json = await response.json();
  return json;
}
