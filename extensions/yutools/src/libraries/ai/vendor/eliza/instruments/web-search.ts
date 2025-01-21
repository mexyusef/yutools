// import { Instrument, Action } from "../types";
// // import { StorageBackend } from "../backends"; // Import StorageBackend
// import axios from "axios";

// export const WebSearchInstrument: Instrument = {
//   name: "web-search",
//   description: "Performs web searches and retrieves results",
//   actions: [
//     {
//       name: "SEARCH_WEB",
//       similes: ["FIND_INFO", "LOOKUP"],
//       description: "Perform a web search",
//       validate: async (message, state) => {
//         return message.content?.query !== undefined;
//       },
//       handler: async (message, state) => {
//         const { storageBackend } = state; // Access storageBackend from state
//         const { query } = message.content;
//         const apiKey = process.env.SEARCH_API_KEY!;
//         const response = await axios.get(
//           `https://api.searchprovider.com/search?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
//         );

//         await storageBackend.createMemory({
//           id: crypto.randomUUID(),
//           content: { text: `Search results: ${JSON.stringify(response.data)}` },
//           userId: message.userId,
//           roomId: message.roomId,
//           createdAt: new Date(),
//         });
//       },
//     },
//   ],
// };

import { Instrument } from "../types/instrument";
import { WebSearchService } from "../services/web-search-service";

export class WebSearchInstrument implements Instrument {
  name = "web-search";
  description = "Performs web searches to gather information";
  private webSearchService: WebSearchService;

  constructor(webSearchService: WebSearchService) {
    this.webSearchService = webSearchService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Gather") || task.includes("Research")) {
      const query = "book topic research";
      const results = await this.webSearchService.searchWeb(query);
      console.log(`Web search results: ${results}`);
    }
  }
}