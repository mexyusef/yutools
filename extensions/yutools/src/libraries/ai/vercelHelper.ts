import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createCohere } from "@ai-sdk/cohere";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { z } from "zod";

// Provider Configuration Interfaces
export interface ProviderConfig {
  apiKey?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export type ProviderName = "openai" | "anthropic" | "google" | "cohere" | "togetherai";

// LLM Wrapper Class
export class LLM {
  private provider: any;

  constructor(providerName: ProviderName, config?: ProviderConfig) {
    switch (providerName) {
      case "openai":
        this.provider = openai(config?.apiKey, { ...config });
        break;
      case "anthropic":
        this.provider = anthropic(config?.apiKey, { ...config });
        break;
      case "google":
        this.provider = google(config?.apiKey, { ...config });
        break;
      case "cohere":
        this.provider = createCohere({ ...config });
        break;
      case "togetherai":
        this.provider = createTogetherAI({ ...config });
        break;
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  }

  async generateText(prompt: string, model: string): Promise<string> {
    const result = await generateText({ model: this.provider(model), prompt });
    return result.text;
  }

  async generateStructuredOutput<T>(
    prompt: string,
    model: string,
    schema: z.ZodSchema<T>,
    schemaName: string,
    schemaDescription: string
  ): Promise<T> {
    const result = await generateObject({
      model: this.provider(model),
      schemaName,
      schemaDescription,
      schema,
      prompt,
    });
    return result.object;
  }
}

// Utility Functions
export function createLLM(providerName: ProviderName, config?: ProviderConfig): LLM {
  return new LLM(providerName, config);
}

export const exampleSchemas = {
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      })
    ),
    steps: z.array(z.string()),
  }),
};

// (async () => {
//   const llm = createLLM("openai", { apiKey: "your-api-key" });

//   // Generate plain text
//   const text = await llm.generateText("What is love?", "gpt-4-turbo");
//   console.log(text);

//   // Generate structured output
//   const recipe = await llm.generateStructuredOutput(
//     "Generate a lasagna recipe.",
//     "gpt-4o-2024-08-06",
//     exampleSchemas.recipe,
//     "recipe",
//     "A recipe for lasagna."
//   );
//   console.log(JSON.stringify(recipe, null, 2));
// })();
