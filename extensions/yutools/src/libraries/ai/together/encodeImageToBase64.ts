import * as fs from "fs";
import * as path from "path";

export function encodeImageToBase64(imagePath: string): string {
  const absolutePath = path.resolve(imagePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  return fs.readFileSync(absolutePath, { encoding: "base64" });
}