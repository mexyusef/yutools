// src/tools/dataFilterTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataFilterTool extends BaseTool {
  /**
   * Filter datasets (e.g., arrays or objects).
   *
   * @param args - The arguments containing the dataset and filter criteria.
   * @returns The filtered data.
   */
  public async execute(args: { data: any[]; criteria: (item: any) => boolean }): Promise<any> {
    try {
      console.log(`Filtering data`);
      const filteredData = _.filter(args.data, args.criteria);
      return {
        filteredData: filteredData,
        message: "Data filtered successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to filter data: ${error.message}`);
    }
  }
}