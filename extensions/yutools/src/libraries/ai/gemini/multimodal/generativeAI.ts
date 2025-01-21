import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CachedContent } from "@google/generative-ai/server";
import { GenerativePart, FileData, GenerativeContent } from "./types";
import { geminiSettings } from "../../config";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";

export class GenerativeAI {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(geminiSettings.getNextProvider().key);
    this.model = this.genAI.getGenerativeModel({ model: geminiSettings.getConfig().model });
  }

  getGenerativeModel() {
    return this.genAI.getGenerativeModel({ model: geminiSettings.getConfig().model });
  }

  getGenerativeModelFromCachedContent(cachedContent: CachedContent) {
    return this.genAI.getGenerativeModelFromCachedContent(cachedContent);
  }

  // New method for function calling
  async callFunction(
    prompt: string,
    functionDeclarations: any[],
    functions: Record<string, Function>,
    modelName: string = "gemini-1.5-flash"
  ) {
    const model = this.genAI.getGenerativeModel({
      model: modelName,
      // tools: { functionDeclarations },
      tools: [
        {
          functionDeclarations,
        },
      ],
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);

    // For simplicity, this uses the first function call found.
    // const call = result.response.functionCalls()[0];
    const call = result.response.functionCalls()?.[0];
    if (call) {
      // Call the executable function named in the function call
      const apiResponse = await functions[call.name](call.args);

      // Send the API response back to the model
      const result2 = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: apiResponse,
          },
        },
      ]);

      return result2.response.text();
    } else {
      console.log("No function calls found.");
    }

    return result.response.text();
  }

  // New method for streaming chat with images
  async startChatWithImages() {
    const model = this.genAI.getGenerativeModel({ model: geminiSettings.getConfig().model });
    return model.startChat();
  }

  // New method for sending messages with images in streaming chat
  async sendMessageWithImageStream(chat: any, prompt: string, imagePath: string, mimeType: string) {
    const imagePart: GenerativePart = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType,
      },
    };

    const result = await chat.sendMessageStream([prompt, imagePart]);
    for await (const chunk of result.stream) {
      process.stdout.write(chunk.text());
    }
  }

  // New method for code execution
  async executeCode(prompt: string) {
    const model = this.genAI.getGenerativeModel({
      model: geminiSettings.getConfig().model,
      tools: [{ codeExecution: {} }],
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // New method for code execution in chat
  async executeCodeInChat(prompt: string) {
    const model = this.genAI.getGenerativeModel({
      model: geminiSettings.getConfig().model,
      tools: [{ codeExecution: {} }],
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateTextStream(prompt: string): Promise<void> {
    const result = await this.model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      process.stdout.write(chunk.text());
    }
  }

  // Function to generate and stream text into the editor
  async generateAndStreamText(prompt: string, openBeside: boolean = true): Promise<void> {
    const result = await this.model.generateContentStream(prompt);

    // Convert the stream into an AsyncIterable<string>
    const textStream = (async function* () {
      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    })();

    // Stream the text into the editor beside current active editor
    await EditorInserter.streamTextIntoEditor(textStream, openBeside);
  }

  async generateMultimodalContent(content: GenerativeContent): Promise<string> {
    const result = await this.model.generateContent([content.prompt, ...content.parts]);
    return result.response.text();
  }

  async generateMultimodalContentStream(content: GenerativeContent): Promise<void> {
    const result = await this.model.generateContentStream([content.prompt, ...content.parts]);
    for await (const chunk of result.stream) {
      process.stdout.write(chunk.text());
    }
  }
}