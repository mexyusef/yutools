import axios from "axios";

export class WebSearchService {
  async searchWeb(query: string): Promise<string> {
    const apiKey = process.env.SEARCH_API_KEY!;
    const response = await axios.get(
      `https://api.searchprovider.com/search?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
    );
    return JSON.stringify(response.data);
  }
}