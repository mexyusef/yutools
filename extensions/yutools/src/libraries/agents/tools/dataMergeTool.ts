// src/tools/dataMergeTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataMergeTool extends BaseTool {
  /**
   * Merge datasets (e.g., arrays or objects).
   *
   * @param args - The arguments containing the datasets and merge options.
   * @returns The merged data.
   */
  public async execute(args: { datasets: any[]; options: any }): Promise<any> {
    try {
      console.log(`Merging datasets`);
      let mergedData: any;

      if (args.options.type === "array") {
        mergedData = _.concat(...args.datasets);
      } else if (args.options.type === "object") {
        mergedData = _.merge({}, ...args.datasets);
      } else {
        throw new Error(`Unsupported merge type: ${args.options.type}`);
      }

      return {
        mergedData: mergedData,
        message: "Data merged successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to merge data: ${error.message}`);
    }
  }
}