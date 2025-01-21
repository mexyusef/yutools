// src/tools/apiTool.ts

import { BaseTool } from "./baseTool";
import axios from "axios";

export class APITool extends BaseTool {
  /**
   * Make an API request (e.g., GET, POST).
   *
   * @param args - The arguments containing the API request details.
   * @returns The API response.
   */
  public async execute(args: { method: string; url: string; data?: any; headers?: any }): Promise<any> {
    try {
      console.log(`Making API request: ${args.method} ${args.url}`);
      const response = await axios({
        method: args.method,
        url: args.url,
        data: args.data,
        headers: args.headers,
      });
      return {
        status: response.status,
        data: response.data,
        message: "API request completed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to make API request: ${error.message}`);
    }
  }
}