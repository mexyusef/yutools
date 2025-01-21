// src/tools/dataPivotTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataPivotTool extends BaseTool {
  /**
   * Pivot datasets (e.g., transform rows into columns).
   *
   * @param args - The arguments containing the dataset and pivot options.
   * @returns The pivoted data.
   */
  public async execute(args: { data: any[]; pivotBy: string; valueField: string }): Promise<any> {
    try {
      console.log(`Pivoting data by: ${args.pivotBy}`);
      const pivotedData = _.chain(args.data)
        .groupBy(args.pivotBy)
        .mapValues((group) => _.sumBy(group, args.valueField))
        .value();
      return {
        pivotedData: pivotedData,
        message: "Data pivoted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to pivot data: ${error.message}`);
    }
  }
}