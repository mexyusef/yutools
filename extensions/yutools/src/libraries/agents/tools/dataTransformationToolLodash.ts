// src/tools/dataTransformationTool.ts

import { BaseTool } from "./baseTool";
import _ from "lodash";

export class DataTransformationToolLodash extends BaseTool {
    /**
     * Transform data using Lodash.
     *
     * @param args - The arguments containing the data and transformation options.
     * @returns The transformed data.
     */
    public async execute(args: { data: any[]; transform: (item: any) => any }): Promise<any> {
        try {
            console.log(`Transforming data`);
            const transformedData = _.map(args.data, args.transform);
            return {
                transformedData: transformedData,
                message: "Data transformed successfully.",
            };
        } catch (error: any) {
            throw new Error(`Failed to transform data: ${error.message}`);
        }
    }
}