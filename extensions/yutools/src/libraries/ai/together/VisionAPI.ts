import Together from "together-ai";
import { togetherSettings } from "../config";
import { prompt_image_simple } from "../gemini/multimodal/prompt_image";
import { ChatSettings, ImageContent } from "./types";
import { formatMessageContent } from "./formatMessageContent";

export const DEFAULT_CONFIG = {
  model: togetherSettings.getConfig().visionModel,
  temperature: togetherSettings.getConfig().temperature,
  maxTokens: togetherSettings.getConfig().maxTokens,
  promptTemplate: prompt_image_simple,
};

export class VisionAPI {
  private together: Together;
  private config: ChatSettings;

  constructor(config: ChatSettings = {}) {
    this.together = new Together({ apiKey: togetherSettings.getNextProvider().key });
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateDescription(
    prompt: string,
    imageContent: ImageContent,
    streamCallback?: (chunk: string) => void
  ): Promise<void> {

    // const chosen_vision_model = this.config.model || DEFAULT_CONFIG.model;
    const model = togetherSettings.validateModel(togetherSettings.getConfig().visionModel as string);
    const formattedContent = formatMessageContent(prompt, imageContent);

    const stream = await this.together.chat.completions.create({
      model,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      messages: [
        {
          role: "user",
          content: formattedContent,
          // content: [
          //   { 
          //     type: "text", 
          //     text: prompt 
          //   },
          //   imageContent
          // ] 
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      streamCallback?.(content);
    }
  }
}

// const chat = new VisionAPI(
//   {
//     model: DEFAULT_CONFIG.model
//   }
// );

// export async function describeImage() {
//   // const prompt = `You are a UX/UI designer. Describe the attached screenshot.`;
//   const imageUrlContent = createImageContentFromUrl("https://example.com/screenshot.png");
//   await chat.generateDescription(
//     prompt_image_simple,
//     imageUrlContent,
//     (chunk) => {
//       process.stdout.write(chunk);
//     }
//   );
// }

// export async function describeLocalImage() {
//   // const prompt = `You are a UX/UI designer. Describe the attached screenshot.`;
//   const localImageContent = createImageContentFromLocalFile("/path/to/local/image.jpeg");
//   await chat.generateDescription(
//     prompt_image_simple,
//     localImageContent,
//     (chunk) => {
//       process.stdout.write(chunk);
//     }
//   );
// }

export const vision_chat = new VisionAPI({ model: DEFAULT_CONFIG.model });