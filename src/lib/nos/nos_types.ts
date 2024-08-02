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

export interface InvidualVideoItem {
  id: number;
  external_id: string;
  type: string;
  title: string;
  description: string;
  published_at: string;
  modified_at: string;
  item_at: string;
  image: Image;
  bios: any[];
  owner: string;
  categories: Category[];
  collections: any[];
  keywords: Keyword[];
  system_tag: Keyword;
  automated_recommendations: boolean;
  push_topics: any[];
  summary: string;
  formats: IInvidualVideoItemFormat[];
  geoprotection: boolean;
  stream_type: string;
  availability: string;
  start_at: string;
  end_at: string;
  channel: string;
  events: Event[];
  banners: Banner[];
}

export interface Banner {
  id: number;
  title: string;
  page_slug: string;
  description: string;
  system_tag: Keyword;
  with_live_icon: boolean;
  image: Image;
}

export interface Category {
  name: string;
  label: string;
  main_category: string;
}

export interface Event {
  title: string;
  date_time: Date;
  type: string;
}

export interface IInvidualVideoItemFormat {
  name: string;
  url: FormatURL;
  width: number;
  height: number;
  label: string;
  mimetype: string;
}

export interface FormatURL {
  hls: string;
  smooth: string;
  mp4: string;
  dash: string;
}
