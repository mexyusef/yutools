import { BaseTool } from "./baseTool";
import { TranslationServiceClient } from "@google-cloud/translate";

export class TranslationTool extends BaseTool {
  private client: TranslationServiceClient;

  constructor() {
    super();
    this.client = new TranslationServiceClient();
  }

  /**
   * Translate text from one language to another using Google Cloud Translation API.
   *
   * @param args - The arguments containing the text and target language.
   * @returns The translated text.
   */
  public async execute(args: { text: string; targetLanguage: string }): Promise<any> {
    try {
      console.log(`Translating text to ${args.targetLanguage}: ${args.text}`);

      const request = {
        parent: `projects/your-project-id/locations/global`,
        contents: [args.text],
        mimeType: "text/plain",
        targetLanguageCode: args.targetLanguage,
      };

      const [response] = await this.client.translateText(request);

      // Check if response.translations is defined and not empty
      if (!response.translations || response.translations.length === 0) {
        throw new Error("No translations found in the response.");
      }

      const translatedText = response.translations[0].translatedText;

      return {
        translatedText: translatedText,
        message: "Text translated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }
}

// const translationTool = new TranslationTool();

// // Example text and target language
// const text = "Hello, world!";
// const targetLanguage = "es"; // Spanish

// translationTool
//   .execute({ text, targetLanguage })
//   .then((result) => {
//     console.log("Translated Text:", result.translatedText);
//   })
//   .catch((error) => {
//     console.error(error.message); // Handle errors
//   });