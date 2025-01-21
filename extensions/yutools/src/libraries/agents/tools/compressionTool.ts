// src/tools/compressionTool.ts

import { BaseTool } from "./baseTool";
import zlib from "zlib";
import { promisify } from "util";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class CompressionTool extends BaseTool {
  /**
   * Compress data.
   *
   * @param args - The arguments containing the data to compress.
   * @returns The compressed data.
   */
  public async execute(args: { data: string }): Promise<any> {
    try {
      console.log(`Compressing data`);
      const compressed = await gzip(args.data);
      return {
        compressedData: compressed.toString("base64"),
        message: "Data compressed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to compress data: ${error.message}`);
    }
  }

  /**
   * Decompress data.
   *
   * @param args - The arguments containing the compressed data.
   * @returns The decompressed data.
   */
  public async decompress(args: { compressedData: string }): Promise<any> {
    try {
      console.log(`Decompressing data`);
      const buffer = Buffer.from(args.compressedData, "base64");
      const decompressed = await gunzip(buffer);
      return {
        decompressedData: decompressed.toString("utf8"),
        message: "Data decompressed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to decompress data: ${error.message}`);
    }
  }
}