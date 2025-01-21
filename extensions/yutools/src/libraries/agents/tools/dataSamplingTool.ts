import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataSamplingTool extends BaseTool {
  /**
   * Sample data from a dataset.
   *
   * @param args - The arguments containing the dataset and sampling options.
   * @returns The sampled data.
   */
  public async execute(args: { data: any[]; sampleSize: number; method?: "random" | "stratified" }): Promise<any> {
    try {
      console.log(`Sampling data with method: ${args.method || "random"}`);

      let sampledData: any[];
      if (args.method === "stratified") {
        // Example: Stratified sampling (group by a specific key and sample proportionally)
        const groupedData = _.groupBy(args.data, "groupKey"); // Replace "groupKey" with the actual key
        sampledData = _.flatMap(groupedData, (group) => _.sampleSize(group, Math.ceil((args.sampleSize / args.data.length) * group.length)));
      } else {
        // Default to random sampling
        sampledData = _.sampleSize(args.data, args.sampleSize);
      }

      return {
        sampledData: sampledData,
        message: "Data sampled successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to sample data: ${error.message}`);
    }
  }
}