import { encodeImageToBase64 } from "./encodeImageToBase64";
import { ImageContent } from "./types";

export function createImageContentFromLocalFile(filePath: string): ImageContent {
  const base64Image = encodeImageToBase64(filePath);
  return {
    type: "image_url",
    image_url: { url: `data:image/jpeg;base64,${base64Image}` },
  };
}
