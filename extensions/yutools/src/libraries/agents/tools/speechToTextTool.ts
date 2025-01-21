import { BaseTool } from "./baseTool";
import { SpeechClient, protos } from "@google-cloud/speech";

export class SpeechToTextTool extends BaseTool {
  private client: SpeechClient;

  constructor() {
    super();
    this.client = new SpeechClient();
  }

  /**
   * Convert speech (audio) to text using Google Cloud Speech-to-Text API.
   *
   * @param args - The arguments containing the audio data.
   * @returns The transcribed text.
   */
  public async execute(args: { audio: Buffer }): Promise<any> {
    try {
      console.log(`Converting speech to text: ${args.audio.length} bytes`);

      const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: {
          content: args.audio.toString("base64"),
        },
        config: {
          encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
          sampleRateHertz: 16000,
          languageCode: "en-US",
        },
      };

      // Explicitly type the response
      const [response] = await this.client.recognize(request);

      // Check if response.results is defined
      if (!response.results) {
        throw new Error("No transcription results found.");
      }

      // Map results to transcription
      const transcription = response.results
        .map((result: any) => result.alternatives[0].transcript)
        .join("\n");

      return {
        text: transcription,
        message: "Speech converted to text successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to convert speech to text: ${error.message}`);
    }
  }
}