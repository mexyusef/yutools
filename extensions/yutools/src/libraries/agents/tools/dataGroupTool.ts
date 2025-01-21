// src/tools/dataGroupTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataGroupTool extends BaseTool {
  /**
   * Group datasets (e.g., arrays or objects).
   *
   * @param args - The arguments containing the dataset and group criteria.
   * @returns The grouped data.
   */
  public async execute(args: { data: any[]; groupBy: string }): Promise<any> {
    try {
      console.log(`Grouping data by: ${args.groupBy}`);
      const groupedData = _.groupBy(args.data, args.groupBy);
      return {
        groupedData: groupedData,
        message: "Data grouped successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to group data: ${error.message}`);
    }
  }
}