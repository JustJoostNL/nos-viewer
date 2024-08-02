export interface IVideoItemsResponse {
  items: VideoItem[];
}

export interface VideoItem {
  id: number;
  type: string;
  title: string;
  description?: string;
  image?: Image;
  owner?: string;
  stream_type?: string;
  availability?: string;
  start_at?: string;
  published_at?: string;
  modified_at?: string;
  end_at?: string;
  item_at?: string;
  channel?: string;
  category?: string;
  date?: string;
  system_tag?: Keyword;
  keywords?: Keyword[];
  duration?: number;
  program?: string;
  geoprotection?: boolean;
  first_frame?: Image;
}

export interface Keyword {
  name: string;
  label: string;
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
