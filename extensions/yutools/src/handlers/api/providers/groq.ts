import Groq from "groq-sdk";
// npm install --save groq-sdk
// https://console.groq.com/docs/openai
import { Anthropic } from "@anthropic-ai/sdk";
import {
    ApiHandlerOptions,
    groqDefaultModelId,
    GroqModelId,
    groqModels,
    ModelInfo 
} from "../models";
import { LLMProviderKey, loadKeysFromFile } from "./config_getter_setter";
import { systemPrompt } from "../common";


let USE_LLM_PROVIDER_KEYS = loadKeysFromFile("GROQ_API_KEYS.json");

function getNextProvider() {
  if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
    throw new Error("No providers found in apiKeys.ts");
  }

  USE_LLM_PROVIDER_KEYS.forEach((p) => {
    if (p.uses === undefined) {
      p.uses = 0;
    }
  });

  const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));
  const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
  const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
  selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;
  return selectedProvider;
}

function createGroqClient(provider: LLMProviderKey): any {
  return new Groq({ apiKey: provider.key });
}

export async function getCompletionGroq(
  messages: Anthropic.Messages.MessageParam[]
): Promise<string> {
  // Get the next provider
  const provider: LLMProviderKey = getNextProvider();
  const groq = createGroqClient(provider);

  const modelId = provider.model ?? groqDefaultModelId;

  try {
    // Format the messages to match the API structure
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: formatMessageContent(msg.content),
      })),
    ];

    // Send the request to the Groq API
    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: modelId, // Your selected model
    });

    // Extract the response content
    const choice = response.choices?.[0];
    if (choice?.message?.content) {
      return choice.message.content; // Return only the response text
    } else {
      throw new Error("No content found in response.");
    }
  } catch (error) {
    console.error("Error in GroqHandler:", error);
    throw error;
  }
}

function formatMessageContent(content: any): string {
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (block.type === "text") {
          return block.text;
        } else if (block.type === "image") {
          return `[Image: ${block.source.media_type}]`;
        } else if (block.type === "tool_use") {
          return `[ToolUse: ${block.name}]`;
        } else if (block.type === "tool_result") {
          return `[ToolResult: ${block.content ? "Success" : "Error"}]`;
        } else {
          return "[Unknown Content]";
        }
      })
      .join("\n");
  } else if (typeof content === "string") {
    return content;
  } else {
    return "[Unsupported Content]";
  }
}
