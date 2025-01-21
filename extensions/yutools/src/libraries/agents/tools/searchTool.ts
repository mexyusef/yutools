import { BaseTool } from "./baseTool";
import axios from "axios";
// import { SerpAPI } from "langchain/tools";
// https://js.langchain.com/docs/integrations/tools/serpapi/
import { SerpAPI } from "@langchain/community/tools/serpapi";

export class SearchToolSerpAPI extends BaseTool {
  private tool: SerpAPI;

  constructor(apiKey: string) {
    super();
    this.tool = new SerpAPI(apiKey);
  }

  async execute(args: { query: string }): Promise<any> {
    return this.tool.call(args.query);
  }
}

// export class SearchTool extends BaseTool {
//   /**
//    * Execute a search query.
//    *
//    * @param args - The arguments containing the search query.
//    * @returns The search results.
//    */
//   public async execute(args: { query: string }): Promise<any> {
//     // Placeholder logic: Simulate a search
//     console.log(`Searching for: ${args.query}`);
//     return [
//       { title: "Result 1", snippet: "This is the first search result." },
//       { title: "Result 2", snippet: "This is the second search result." },
//     ];
//   }
// }

export class SearchTool2 extends BaseTool {
  async execute(args: { query: string }): Promise<any> {
    try {
      // Simulate a search operation
      const result = `Search results for: ${args.query}`;
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Search tool execution failed: ${error.message}`);
      }
      throw new Error("Search tool execution failed due to an unknown error.");
    }
  }
}

export class SearchTool extends BaseTool {
  /**
   * Execute a search query using the DuckDuckGo API.
   *
   * @param args - The arguments containing the search query.
   * @returns The search results.
   */
  public async execute(args: { query: string }): Promise<any> {
    try {
      console.log(`Searching for: ${args.query}`);
      const response = await axios.get("https://api.duckduckgo.com/", {
        params: {
          q: args.query,
          format: "json",
          no_html: 1,
          skip_disambig: 1,
        },
      });

      const results = response.data.RelatedTopics.map((topic: any) => ({
        title: topic.Text,
        url: topic.FirstURL,
        snippet: topic.Text,
      }));

      return results;
    } catch (error: any) {
      throw new Error(`Failed to execute search: ${error.message}`);
    }
  }
}