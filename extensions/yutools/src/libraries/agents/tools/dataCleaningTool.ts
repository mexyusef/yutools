import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataCleaningTool extends BaseTool {
  /**
   * Clean data by removing duplicates, handling missing values, etc.
   *
   * @param args - The arguments containing the dataset and cleaning options.
   * @returns The cleaned data.
   */
  public async execute(args: { data: any[]; options: { removeDuplicates?: boolean; fillMissing?: any } }): Promise<any> {
    try {
      console.log(`Cleaning data with options: ${JSON.stringify(args.options)}`);

      let cleanedData = args.data;

      if (args.options.removeDuplicates) {
        cleanedData = _.uniqBy(cleanedData, JSON.stringify);
      }

      if (args.options.fillMissing !== undefined) {
        cleanedData = cleanedData.map((item) => {
          const newItem = { ...item };
          for (const key in newItem) {
            if (newItem[key] === null || newItem[key] === undefined) {
              newItem[key] = args.options.fillMissing;
            }
          }
          return newItem;
        });
      }

      return {
        cleanedData: cleanedData,
        message: "Data cleaned successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to clean data: ${error.message}`);
    }
  }
}