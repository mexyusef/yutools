import { BaseTool } from "./baseTool";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { Readable } from "stream";

export class VideoProcessingTool extends BaseTool {
  /**
   * Process a video (e.g., trim, resize) using FFmpeg.
   *
   * @param args - The arguments containing the video data and processing options.
   * @returns The processed video.
   */
  public async execute(args: { video: Buffer; options: any }): Promise<any> {
    try {
      console.log(`Processing video: ${args.video.length} bytes`);

      const outputPath = `output_${Date.now()}.mp4`;

      // Convert the Buffer to a Readable stream
      const videoStream = new Readable();
      videoStream.push(args.video);
      videoStream.push(null); // Signal the end of the stream

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(videoStream) // Use the Readable stream as input
          .output(outputPath)
          .size(`${args.options.width}x${args.options.height}`)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      const processedVideo = await fs.promises.readFile(outputPath);
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

// const videoProcessingTool = new VideoProcessingTool();
// // Example video buffer (replace with actual video data)
// const videoBuffer = fs.readFileSync("path/to/input/video.mp4");
// videoProcessingTool
//   .execute({
//     video: videoBuffer,
//     options: { width: 640, height: 480 }, // Example processing options
//   })
//   .then((result) => {
//     console.log(result.message); // "Video processed successfully."
//     fs.writeFileSync("path/to/output/video.mp4", result.video); // Save the processed video
//   })
//   .catch((error) => {
//     console.error(error.message); // Handle errors
//   });
