import * as fs from "fs";
import * as path from "path";
import { BaseTool } from "..";
import ffmpeg from "fluent-ffmpeg";

export class VideoProcessingToolTempFile extends BaseTool {
  public async execute(args: { video: Buffer; options: any }): Promise<any> {
    try {
      console.log(`Processing video: ${args.video.length} bytes`);

      const tempInputPath = path.join(__dirname, `temp_input_${Date.now()}.mp4`);
      const outputPath = path.join(__dirname, `output_${Date.now()}.mp4`);

      // Save the Buffer to a temporary file
      await fs.promises.writeFile(tempInputPath, args.video);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(tempInputPath) // Use the temporary file as input
          .output(outputPath)
          .size(`${args.options.width}x${args.options.height}`)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      const processedVideo = await fs.promises.readFile(outputPath);

      // Clean up temporary files
      await fs.promises.unlink(tempInputPath);
      await fs.promises.unlink(outputPath);

      return {
        video: processedVideo,
        message: "Video processed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to process video: ${error.message}`);
    }
  }
}