import { BaseTool } from "./baseTool";
import { SessionsClient } from "@google-cloud/dialogflow";

export class ChatbotTool extends BaseTool {
  private sessionClient: SessionsClient;
  private sessionPath: string;

  constructor() {
    super();
    this.sessionClient = new SessionsClient();
    this.sessionPath = this.sessionClient.projectAgentSessionPath(
      "your-project-id",
      "your-session-id"
    );
  }

  /**
   * Generate a chatbot response using Dialogflow.
   *
   * @param args - The arguments containing the user's message.
   * @returns The chatbot's response.
   */
  public async execute(args: { message: string }): Promise<any> {
    try {
      console.log(`Chatbot received message: ${args.message}`);

      const request = {
        session: this.sessionPath,
        queryInput: {
          text: {
            text: args.message,
            languageCode: "en-US",
          },
        },
      };

      const [response] = await this.sessionClient.detectIntent(request);

      // Check if response.queryResult is defined
      if (!response.queryResult) {
        throw new Error("No query result found in the response.");
      }

      const chatbotResponse = response.queryResult.fulfillmentText;

      return {
        response: chatbotResponse,
        message: "Chatbot response generated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to generate chatbot response: ${error.message}`);
    }
  }
}