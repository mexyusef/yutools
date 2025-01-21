// src/tools/fileCompressTool.ts

import { BaseTool } from "./baseTool";
import archiver from "archiver";
import fs from "fs";
import path from "path";

export class FileCompressTool extends BaseTool {
  /**
   * Compress files into a ZIP archive.
   *
   * @param args - The arguments containing the file paths and output path.
   * @returns The compression result.
   */
  public async execute(args: { files: string[]; outputPath: string }): Promise<any> {
    try {
      console.log(`Compressing files to: ${args.outputPath}`);
      const output = fs.createWriteStream(args.outputPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(`Archive created: ${archive.pointer()} bytes`);
      });

      archive.on("error", (error: any) => {
        throw new Error(`Failed to compress files: ${error.message}`);
      });

      archive.pipe(output);

      args.files.forEach((file) => {
        archive.file(file, { name: path.basename(file) });
      });

      await archive.finalize();
      return {
        message: "Files compressed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to compress files: ${error.message}`);
    }
  }
}