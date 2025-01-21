
export interface ImageInput {
  type: "url" | "base64";
  data: string; // URL or base64 string
}


export interface ImageContent {
  type: "image_url";
  image_url: {
      url: string;
  };
}

export interface TextContent {
  type: "text";
  text: string;
}

export type MessageContent = TextContent | ImageContent;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: MessageContent[];
}
// export interface ChatMessage {
//   role: "user" | "assistant" | "system";
//   content: Array<{
//     type: "text" | "image_url";
//     text?: string;
//     image_url?: { url: string };
//   }>;
// }

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | null;
  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: object;
    };
  }>;
  tool_choice?: "auto" | { type: "function"; function: { name: string } };
  response_format?: { type: "json_object" };
}
// export interface ChatCompletionRequest {
//   model: string;
//   messages: ChatMessage[];
//   temperature?: number;
//   max_tokens?: number;
//   top_p?: number;
//   stream?: boolean;
//   stop?: string | string[] | null;
//   response_format?: { type: "json_object" };
// }

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
      tool_calls?: Array<{
        id: string;
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
  }>;
}
// export interface ChatCompletionResponse {
//   id: string;
//   choices: {
//       message: {
//           content: string;
//       };
//   }[];
// }

export class GroqError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}
