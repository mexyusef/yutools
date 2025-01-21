// import { BaseTool } from "./baseTool";

// export class DataAggregationTool extends BaseTool {
//   /**
//    * Aggregate data (e.g., sum, average).
//    *
//    * @param args - The arguments containing the data and aggregation options.
//    * @returns The aggregated data.
//    */
//   public async execute(args: { data: number[]; operation: string }): Promise<any> {
//     try {
//       console.log(`Aggregating data: ${args.operation}`);
//       let result: number;

//       switch (args.operation) {
//         case "sum":
//           result = args.data.reduce((acc, val) => acc + val, 0);
//           break;
//         case "average":
//           result = args.data.reduce((acc, val) => acc + val, 0) / args.data.length;
//           break;
//         default:
//           throw new Error(`Unsupported operation: ${args.operation}`);
//       }

//       return {
//         result: result,
//         message: "Data aggregated successfully.",
//       };
//     } catch (error: any) {
//       throw new Error(`Failed to aggregate data: ${error.message}`);
//     }
//   }
// }
// src/tools/dataAggregationTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataAggregationTool extends BaseTool {
  /**
   * Aggregate data using Lodash.
   *
   * @param args - The arguments containing the data and aggregation options.
   * @returns The aggregated data.
   */
  public async execute(args: { data: number[]; operation: string }): Promise<any> {
    try {
      console.log(`Aggregating data: ${args.operation}`);
      let result: number;

      switch (args.operation) {
        case "sum":
          result = _.sum(args.data);
          break;
        case "average":
          result = _.mean(args.data);
          break;
        default:
          throw new Error(`Unsupported operation: ${args.operation}`);
      }

      return {
        result: result,
        message: "Data aggregated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to aggregate data: ${error.message}`);
    }
  }
}