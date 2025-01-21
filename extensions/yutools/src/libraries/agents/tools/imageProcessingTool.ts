// import { BaseTool } from "./baseTool";

// export class ImageProcessingTool extends BaseTool {
//   /**
//    * Process an image (e.g., resize, filter).
//    *
//    * @param args - The arguments containing the image data and processing options.
//    * @returns The processed image.
//    */
//   public async execute(args: { image: Buffer; options: any }): Promise<any> {
//     try {
//       console.log(`Processing image: ${args.image.length} bytes`);
//       // Placeholder logic: Simulate image processing
//       return {
//         image: args.image, // Return the same image for now
//         message: "Image processed successfully.",
//       };
//     } catch (error: any) {
//       throw new Error(`Failed to process image: ${error.message}`);
//     }
//   }
// }
// src/tools/imageProcessingTool.ts

import { BaseTool } from "./baseTool";
import sharp from "sharp";

export class ImageProcessingTool extends BaseTool {
  /**
   * Process an image (e.g., resize, filter) using Sharp.
   *
   * @param args - The arguments containing the image data and processing options.
   * @returns The processed image.
   */
  public async execute(args: { image: Buffer; options: any }): Promise<any> {
    try {
      console.log(`Processing image: ${args.image.length} bytes`);

      const processedImage = await sharp(args.image)
        .resize(args.options.width, args.options.height)
        .toBuffer();

      return {
        image: processedImage,
        message: "Image processed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }
}