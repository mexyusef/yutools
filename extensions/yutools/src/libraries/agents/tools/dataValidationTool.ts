// src/tools/dataValidationTool.ts

import { BaseTool } from "./baseTool";
import Joi from "joi";

export class DataValidationTool extends BaseTool {
  /**
   * Validate data against a schema.
   *
   * @param args - The arguments containing the data and schema.
   * @returns The validation result.
   */
  public async execute(args: { data: any; schema: any }): Promise<any> {
    try {
      console.log(`Validating data`);
      const schema = Joi.object(args.schema);
      const { error, value } = schema.validate(args.data);

      if (error) {
        throw new Error(`Validation failed: ${error.details[0].message}`);
      }

      return {
        validatedData: value,
        message: "Data validated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to validate data: ${error.message}`);
    }
  }
}