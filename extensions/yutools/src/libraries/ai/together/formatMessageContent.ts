import { ImageContent } from "./types";

export function formatMessageContent(
  prompt: string,
  imageContent: ImageContent
): string {
  if (imageContent.type === "image_url") {
    return `${prompt}\nImage URL: ${imageContent.image_url.url}`;
  }
  return prompt;
}
