export interface ImageContent {
  type: "image_url";
  image_url: { url: string };
}

export interface ChatSettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
