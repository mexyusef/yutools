// import { BaseTool } from "./baseTool";

// export class DataAnalysisTool extends BaseTool {
//   /**
//    * Perform data analysis (e.g., statistical analysis, visualization).
//    *
//    * @param args - The arguments containing the data and analysis options.
//    * @returns The analysis results.
//    */
//   public async execute(args: { data: any[]; options: any }): Promise<any> {
//     try {
//       console.log(`Analyzing data: ${args.data.length} rows`);
//       // Placeholder logic: Simulate data analysis
//       return {
//         summary: {
//           mean: 42, // Example statistical result
//           median: 40,
//           mode: 35,
//         },
//         message: "Data analyzed successfully.",
//       };
//     } catch (error: any) {
//       throw new Error(`Failed to analyze data: ${error.message}`);
//     }
//   }
// }
// src/tools/dataAnalysisTool.ts

import { BaseTool } from "./baseTool";
import { PythonInterpreterTool } from "./pythonInterpreterTool";

export class DataAnalysisTool extends BaseTool {
  private pythonInterpreter: PythonInterpreterTool;

  constructor() {
    super();
    this.pythonInterpreter = new PythonInterpreterTool();
  }

  /**
   * Perform data analysis using Pandas (via Python).
   *
   * @param args - The arguments containing the data and analysis options.
   * @returns The analysis results.
   */
  public async execute(args: { data: any[]; options: any }): Promise<any> {
    try {
      console.log(`Analyzing data: ${args.data.length} rows`);

      const pythonCode = `
import pandas as pd
import json

data = ${JSON.stringify(args.data)}
df = pd.DataFrame(data)
summary = {
    "mean": df.mean().to_dict(),
    "median": df.median().to_dict(),
    "mode": df.mode().iloc[0].to_dict(),
}
print(json.dumps(summary))
            `;

      const result = await this.pythonInterpreter.execute({ code: pythonCode });
      return {
        summary: JSON.parse(result),
        message: "Data analyzed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to analyze data: ${error.message}`);
    }
  }
}