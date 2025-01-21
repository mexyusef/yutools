import { groqSettings } from "../config";
import { GroqVisionClient } from "./GroqVisionClient";
import { ChatCompletionRequest, ChatCompletionResponse, GroqError, ImageInput } from "./types";

export async function toolUseWithImage(
  client: GroqVisionClient,
  image: ImageInput,
  toolDefinition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: object;
    };
  }): Promise<any> {
  const request: ChatCompletionRequest = {
    model: "llama-3.2-11b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image and use the tool." },
          {
            type: "image_url",
            image_url: {
              url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
            },
          },
        ],
      },
    ],
    tools: [toolDefinition], // Now matches the expected type
    tool_choice: "auto",
  };

  const response = await fetch(client["baseUrl"], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${client["apiKey"]}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new GroqError(response.status, await response.text());
  }

  const data: ChatCompletionResponse = await response.json();
  return data.choices[0].message.tool_calls;
}