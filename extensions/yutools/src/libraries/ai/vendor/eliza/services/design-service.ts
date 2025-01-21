// src/services/design-service.ts
import axios from "axios";

export class DesignService {
  private figmaApiKey: string;

  constructor(figmaApiKey: string) {
    this.figmaApiKey = figmaApiKey;
  }

  async createDesign(task: string): Promise<string> {
    try {
      // Fetch design from Figma API
      const response = await axios.get(`https://api.figma.com/v1/files/your-file-key`, {
        headers: {
          Authorization: `Bearer ${this.figmaApiKey}`,
        },
      });

      return `Generated design for: ${task}\n${JSON.stringify(response.data, null, 2)}`;
    } catch (error) {
      console.error("DesignService: Error generating design", error);
      throw error;
    }
  }
}