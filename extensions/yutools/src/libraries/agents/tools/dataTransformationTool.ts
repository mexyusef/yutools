// src/tools/dataTransformationTool.ts

import { BaseTool } from "./baseTool";

export class DataTransformationTool extends BaseTool {
  /**
   * Transform data (e.g., map, filter).
   *
   * @param args - The arguments containing the data and transformation options.
   * @returns The transformed data.
   */
  public async execute(args: { data: any[]; transform: (item: any) => any }): Promise<any> {
    try {
      console.log(`Transforming data`);
      const transformedData = args.data.map(args.transform);
      return {
        transformedData: transformedData,
        message: "Data transformed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to transform data: ${error.message}`);
    }
  }
}