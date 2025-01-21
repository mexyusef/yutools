import fs from "fs";
import { GenerativePart } from "./types";

export function fileToGenerativePart(path: string, mimeType: string): GenerativePart {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}