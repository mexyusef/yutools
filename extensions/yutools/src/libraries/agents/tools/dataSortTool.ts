// src/tools/dataSortTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataSortTool extends BaseTool {
  /**
   * Sort datasets (e.g., arrays or objects).
   *
   * @param args - The arguments containing the dataset and sort options.
   * @returns The sorted data.
   */
  public async execute(args: { data: any[]; sortBy: string; order: "asc" | "desc" }): Promise<any> {
    try {
      console.log(`Sorting data by: ${args.sortBy} (${args.order})`);
      const sortedData = _.orderBy(args.data, [args.sortBy], [args.order]);
      return {
        sortedData: sortedData,
        message: "Data sorted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to sort data: ${error.message}`);
    }
  }
}