import { ILiveAndBroadcastResponse } from "./nos_types";

const liveAndBoradcastUrl =
  "https://api.jstt.me/api/v2/nos/nosapp/v4/livestreams-and-broadcasts";

export class NosApiError extends Error {
  constructor(
    message: string,
    public readonly response: Response,
  ) {
    super(message);

    this.name = "NosApiError";
  }
}

export async function getLivestreamsAndBroadcasts(): Promise<ILiveAndBroadcastResponse> {
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
