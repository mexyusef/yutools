import type {
  BaseLanguageModelInterface,
  BaseLanguageModelCallOptions,
  BaseLanguageModelInput,
} from "@langchain/core/language_models/base";
import { IGenericLLM } from "../interfaces/genericLLM";
import { Callbacks } from "@langchain/core/callbacks/manager";
import { BaseMessage } from "@langchain/core/messages";
import { BasePromptValue } from "@langchain/core/prompt_values";
import { LLMResult } from "@langchain/core/outputs";
import { AIMessage } from "@langchain/core/messages";
import { IterableReadableStreamInterface } from "@langchain/core/utils/stream";

// Define a type for the message object
interface Message {
  role: string;
  content: string;
}

export class GenericLLMAdapter implements BaseLanguageModelInterface {
  private llm: IGenericLLM;

  constructor(llm: IGenericLLM) {
    this.llm = llm;
  }

  async invoke(messages: BaseLanguageModelInput, options?: BaseLanguageModelCallOptions): Promise<string> {
    // Convert the input to the format expected by IGenericLLM
    const formattedMessages = this.formatMessages(messages);
    const response = await this.llm.invoke(formattedMessages);
    return response.content;
  }

  private formatMessages(input: BaseLanguageModelInput): { role: string; content: string }[] {
    // Implement logic to convert BaseLanguageModelInput to the format expected by IGenericLLM
    if (typeof input === "string") {
      return [{ role: "user", content: input }];
    }

    // Cast input to an array of Message objects
    const messages = input as Message[];
    return messages.map((message: Message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  // Implement other required methods from BaseLanguageModelInterface
  async generatePrompt(
    promptValues: BasePromptValue[],
    options?: BaseLanguageModelCallOptions | string[],
    callbacks?: Callbacks
  ): Promise<LLMResult> {
    // Convert BasePromptValue[] to BaseLanguageModelInput
    const input = promptValues.map((prompt) => prompt.toString());
    const response = await this.invoke(input, options as BaseLanguageModelCallOptions);
    return {
      generations: [[{ text: response }]],
    };
  }

  async predict(text: string, options?: BaseLanguageModelCallOptions): Promise<string> {
    return this.invoke(text, options);
  }

  async predictMessages(
    messages: BaseMessage[],
    options?: BaseLanguageModelCallOptions | string[],
    callbacks?: Callbacks
  ): Promise<BaseMessage> {
    // Convert BaseMessage[] to BaseLanguageModelInput
    const input = messages.map((message) => ({
      role: message._getType(),
      content: message.content,
    }));
    const response = await this.invoke(input, options as BaseLanguageModelCallOptions);
    return new AIMessage(response); // Return a BaseMessage object
  }

  // Add other required methods as needed
  _modelType(): string {
    return "GenericLLMAdapter";
  }

  _llmType(): string {
    return "generic";
  }

  async getNumTokens(content: string): Promise<number> {
    // Implement token counting logic if needed
    return content.split(" ").length; // Simplified example
  }

  // Implement missing properties
  callKeys = [];
  _identifyingParams(): Record<string, any> {
    return {};
  }
  serialize(): { _model: string; _type: string } {
    return { _model: this._modelType(), _type: this._llmType() };
  }
  lc_serializable = false;
  lc_namespace: string[] = [];
  lc_aliases: Record<string, string> = {};
  text = "";
  toJSON() {
    return {};
  }
  toString() {
    return "";
  }

  // Implement additional missing properties
  batch(input: BaseLanguageModelInput[], options?: BaseLanguageModelCallOptions): Promise<string[]> {
    return Promise.all(input.map((i) => this.invoke(i, options)));
  }

  async stream(input: BaseLanguageModelInput, options?: BaseLanguageModelCallOptions): Promise<IterableReadableStreamInterface<any>> {
    throw new Error("Streaming not supported.");
  }

  async *transform(generator: AsyncGenerator<BaseLanguageModelInput, any, any>, options: BaseLanguageModelCallOptions): AsyncGenerator<string> {
    for await (const input of generator) {
      yield await this.invoke(input, options);
    }
  }

  getName(): string {
    return this._modelType();
  }

  lc_id: string[] = [];
}