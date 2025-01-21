import { BaseTool } from "./baseTool";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

export class TextToSpeechTool extends BaseTool {
  private client: TextToSpeechClient;

  constructor() {
    super();
    this.client = new TextToSpeechClient();
  }

  /**
   * Convert text to speech using Google Cloud Text-to-Speech API.
   *
   * @param args - The arguments containing the text to convert.
   * @returns The generated audio.
   */
  public async execute(args: { text: string }): Promise<any> {
    try {
      console.log(`Converting text to speech: ${args.text}`);

      const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text: args.text },
        voice: {
          languageCode: "en-US",
          ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        },
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
      };

      // Explicitly type the response
      const [response] = await this.client.synthesizeSpeech(request);
      const audio = response.audioContent;

      return {
        audio: audio,
        message: "Text converted to speech successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to convert text to speech: ${error.message}`);
    }
  }
}