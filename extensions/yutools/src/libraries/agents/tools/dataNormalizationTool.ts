// import { BaseTool } from "./baseTool";

// export class DataNormalizationTool extends BaseTool {
//   /**
//    * Normalize datasets (e.g., scale values to a range).
//    *
//    * @param args - The arguments containing the dataset and normalization options.
//    * @returns The normalized data.
//    */
//   public async execute(args: { data: number[]; min: number; max: number }): Promise<any> {
//     try {
//       console.log(`Normalizing data to range [${args.min}, ${args.max}]`);
//       const normalizedData = args.data.map((value) => {
//         const normalized = (value - Math.min(...args.data)) / (Math.max(...args.data) - Math.min(...args.data));
//         return args.min + normalized * (args.max - args.min);
//       });
//       return {
//         normalizedData: normalizedData,
//         message: "Data normalized successfully.",
//       };
//     } catch (error: any) {
//       throw new Error(`Failed to normalize data: ${error.message}`);
//     }
//   }
// }
// src/tools/dataNormalizationTool.ts

import { BaseTool } from "./baseTool";
import { min, max, subtract, divide, multiply, add } from "mathjs";

export class DataNormalizationTool extends BaseTool {
  /**
   * Normalize datasets (e.g., scale values to a range).
   *
   * @param args - The arguments containing the dataset and normalization options.
   * @returns The normalized data.
   */
  public async execute(args: { data: number[]; min: number; max: number }): Promise<any> {
    try {
      console.log(`Normalizing data to range [${args.min}, ${args.max}]`);
      const dataMin = min(args.data);
      const dataMax = max(args.data);
      const normalizedData = args.data.map((value) => {
        const normalized = divide(subtract(value, dataMin), subtract(dataMax, dataMin));
        return add(args.min, multiply(normalized, subtract(args.max, args.min)));
      });
      return {
        normalizedData: normalizedData,
        message: "Data normalized successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to normalize data: ${error.message}`);
    }
  }
}