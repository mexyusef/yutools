// src/tools/googleSearchTool.ts

import { BaseTool } from "./baseTool";
import axios from "axios";

export class GoogleSearchTool extends BaseTool {
  private apiKey: string;
  private searchEngineId: string;

  constructor(apiKey: string, searchEngineId: string) {
    super();
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  /**
   * Execute a search query using the Google Custom Search API.
   *
   * @param args - The arguments containing the search query.
   * @returns The search results.
   */
  public async execute(args: { query: string }): Promise<any> {
    try {
      console.log(`Searching Google for: ${args.query}`);
      const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
          q: args.query,
          key: this.apiKey,
          cx: this.searchEngineId,
        },
      });

      const results = response.data.items.map((item: any) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
      }));

      return results;
    } catch (error: any) {
      throw new Error(`Failed to execute Google search: ${error.message}`);
    }
  }
}