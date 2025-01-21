import { groqSettings } from "../config";
import { prompt_analyze_image_with_tool } from "../gemini/multimodal/prompt_image";
import { get_dog_facts } from "./get_dog_facts";
import { ChatCompletionRequest, ChatCompletionResponse, ChatMessage, GroqError, ImageInput } from "./types";

export class GroqVisionClient {
  private apiKey: string;
  private baseUrl: string = "https://api.groq.com/openai/v1/chat/completions";
  // private readonly apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor() {
    this.apiKey = groqSettings.getNextProvider().key;
  }

  async analyzeImageWithTool(image: { type: "url" | "base64"; data: string }): Promise<any> {
    // Step 1: Define the tool
    const toolDefinition = {
      type: "function" as const,
      function: {
        name: "get_dog_facts",
        description: "Gets facts about a given dog breed",
        parameters: {
          type: "object",
          properties: {
            breed_name: {
              type: "string",
              description: "The name of the dog breed",
            },
          },
          required: ["breed_name"],
        },
      },
    };

    // Step 2: Make the API request
    const request = {
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt_analyze_image_with_tool },
            {
              type: "image_url",
              image_url: {
                url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
              },
            },
          ],
        },
      ],
      tools: [toolDefinition], // Include the tool
      tool_choice: "auto", // Let the API decide which tool to call
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Step 3: Process the tool call
    const toolCalls = data.choices[0].message.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // Step 4: Execute the tool implementation
      if (functionName === "get_dog_facts") {
        const breedName = functionArgs.breed_name;
        const dogFacts = await get_dog_facts(breedName); // Call the tool implementation
        return dogFacts;
      }
    }

    throw new Error("No tool call found in the response.");
  }

  async analyzeImage(image: ImageInput, prompt: string, model: string): Promise<string> {
    const message: ChatMessage = {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
          },
        },
      ],
    };

    const request: ChatCompletionRequest = {
      model,
      messages: [message],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // throw new Error(`Groq API error: ${response.statusText}`);
      throw new GroqError(response.status, await response.text());
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  }

  async toolUseWithImage(image: { type: "url" | "base64"; data: string }, toolDefinition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: object;
    };
  }): Promise<any> {
    const request = {
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt_analyze_image_with_tool },
            {
              type: "image_url",
              image_url: {
                url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
              },
            },
          ],
        },
      ],
      tools: [toolDefinition],
      tool_choice: "auto",
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.tool_calls;
  }

  // Helper method to create headers
  private createHeaders(): Headers {
    return new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  // Method to encode a local image to base64
  public static async encodeImageToBase64(imagePath: string): Promise<string> {
    const fs = await import("fs");
    return fs.promises
      .readFile(imagePath)
      .then((data) => data.toString("base64"));
  }

  // Method to capture an image from the clipboard and convert it to base64
  public static async getImageFromClipboard(): Promise<string | null> {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      throw new Error("Clipboard API is not supported in this environment.");
    }

    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith("image/")) {
          const blob = await item.getType(type);
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      }
    }

    return null; // No image found in the clipboard
  }

  // Method to send a chat completion request
  public async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Groq Vision API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return response.json() as Promise<ChatCompletionResponse>;
  }

  // Method to handle URL-based image inputs
  public async processImageFromUrl(
    model: string,
    imageUrl: string,
    prompt: string
  ): Promise<string> {
    const request: ChatCompletionRequest = {
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 1024,
    };

    const response = await this.createChatCompletion(request);
    return response.choices[0].message.content;
  }

  // Method to handle base64-encoded image inputs
  public async processImageFromBase64(
    // model: string,
    base64Image: string,
    prompt: string
  ): Promise<string> {
    const request: ChatCompletionRequest = {
      model: groqSettings.getConfig().visionModel ?? groqSettings.validVisionModels[0],
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: base64Image },
            },
          ],
        },
      ],
      temperature: groqSettings.getConfig().temperature, //1,
      max_tokens: groqSettings.getConfig().maxTokens, // 1024,
    };
    const response = await this.createChatCompletion(request);
    return response.choices[0].message.content;
  }

  // Example multi-turn conversation support
  public async continueConversation(
    model: string,
    messages: ChatMessage[]
  ): Promise<string> {
    const request: ChatCompletionRequest = {
      model,
      messages,
      temperature: 1,
      max_tokens: 1024,
    };

    const response = await this.createChatCompletion(request);
    return response.choices[0].message.content;
  }

}

// GroqVisionClient.getImageFromClipboard()

// (async () => {
//     try {
//       const base64Image = await GroqVisionClient.getImageFromClipboard();
//       if (base64Image) {
//         console.log("Image successfully retrieved from clipboard!");
//         // Now you can process the image using the API
//         const api = new GroqVisionClient("your-api-key");
//         const result = await api.processImageFromBase64(
//           "your-model-name", // https://console.groq.com/docs/vision
//           base64Image,
//           "Describe the image"
//         );
//         console.log("API Response:", result);
//       } else {
//         console.log("No image found in the clipboard.");
//       }
//     } catch (error) {
//       console.error("Error accessing clipboard:", error.message);
//     }
//   })();


// const Groq = require('groq-sdk');

// const groq = new Groq();
// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     "messages": [
//       {
//         "role": "user",
//         "content": [
//           {
//             "type": "text",
//             "text": "What's in this image?"
//           },
//           {
//             "type": "image_url",
//             "image_url": {
//               "url": "https://upload.wikimedia.org/wikipedia/commons/f/f2/LPU-v1-die.jpg"
//             }
//           }
//         ]
//       }
//     ],
//     "model": "llama-3.2-11b-vision-preview",
//     "temperature": 1,
//     "max_tokens": 1024,
//     "top_p": 1,
//     "stream": false,
//     "stop": null
//   });

//    console.log(chatCompletion.choices[0].message.content);
// }

// main();