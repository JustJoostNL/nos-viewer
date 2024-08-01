export interface ILiveAndBroadcastResponse {
  items: LiveItem[];
}

export interface LiveItem {
  id: number;
  type: string;
  title: string;
  description?: string;
  image?: Image;
  owner?: string;
  stream_type?: string;
  availability?: string;
  start_at?: string;
  end_at?: string;
  channel?: string;
  category?: string;
  date?: string;
  duration?: number;
  program?: string;
}

export interface Image {
  copyright?: string;
  formats: Format[];
  aspect_ratios: AspectRatio[];
}

export interface AspectRatio {
  ratio: string;
  formats: Format[];
}

export interface Format {
  width: number;
  height: number;
  url: URL;
}

export interface URL {
  jpg: string;
}
