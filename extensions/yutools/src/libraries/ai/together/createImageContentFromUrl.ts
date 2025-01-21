import { ImageContent } from "./types";

export function createImageContentFromUrl(url: string): ImageContent {
  return {
    type: "image_url",
    image_url: { url },
  };
}