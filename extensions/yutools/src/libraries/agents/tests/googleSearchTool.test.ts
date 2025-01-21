// test/googleSearchTool.test.ts

import { GoogleSearchTool } from "../tools";

// Replace with your actual API key and search engine ID
const apiKey = "YOUR_GOOGLE_API_KEY";
const searchEngineId = "YOUR_SEARCH_ENGINE_ID";

// Create an instance of the GoogleSearchTool
const googleSearchTool = new GoogleSearchTool(apiKey, searchEngineId);

// Test the GoogleSearchTool
googleSearchTool.execute({ query: "TypeScript agents" })
  .then(results => console.log("Google search results:", results))
  .catch((error: any) => console.error(error));
