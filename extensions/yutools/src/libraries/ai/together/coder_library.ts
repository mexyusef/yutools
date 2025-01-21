// uneh https://claude.ai/chat/5b479d8a-fb47-477c-aad9-11014b1171de
// npm install together-ai 
// npm install @codesandbox/sandpack-react
// npm install @codesandbox/sdk
// https://docs.together.ai/docs/code-execution
// import { Together } from 'together-ai';
import Together from "together-ai";
// import ChatCompletion from 'together-ai';
// import ChatCompletionChunk from 'together-ai';
// import Stream from 'together-ai';
import { TogetherSettings, togetherSettings } from '../config';

export interface ProjectGeneratorConfig {
  togetherApiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateCodeOptions {
  prompt: string;
  stream?: boolean;
  onProgress?: (code: string) => void;
}

export class ProjectGenerator {
  private together: Together;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: ProjectGeneratorConfig) {
    // C:\ai\yuagent\extensions\yutools\node_modules\together-ai\src\index.ts
    this.together = new Together({ apiKey: togetherSettings.getNextProvider().key });
    this.model = config.model || togetherSettings.shortNames['lama-31-405']
      // 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
  }

  private readonly systemPrompt = `
    You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully:

    - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
    - Make sure the React app is interactive and functional by creating state when needed and having no required props
    - If you use any imports from React like useState or useEffect, make sure to import them directly
    - Use TypeScript as the language for the React component
    - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
    - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
    - Please ONLY return the full React code starting with the imports, nothing else. It's very important that you only return the React code with imports.
    - DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.
    
    NO LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
  `;

  private async* readStream(response: ReadableStream<Uint8Array>): AsyncGenerator<any, void, unknown> {
    const decoder = new TextDecoder();
    const reader = response.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const parts = text.split('\n');

        for (const part of parts) {
          if (part) {
            yield JSON.parse(part);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async generateCode({ prompt, stream = false, onProgress }: GenerateCodeOptions): Promise<string> {
    const response = await this.together.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    if (!stream) {
      // return response.choices[0].message.content;
      // Handle non-streaming response
      const hasil: Together.Chat.Completions.ChatCompletion = response as Together.Chat.Completions.ChatCompletion;
      return hasil.choices[0].message?.content as string;
    }

    // Handle streaming response
    let generatedCode = '';
    const readableStream = (response as any).toReadableStream();

    for await (const result of this.readStream(readableStream)) {
      const newContent = result.choices.map((c: any) => c.text ?? '').join('');
      generatedCode += newContent;

      if (onProgress) {
        onProgress(generatedCode);
      }
    }

    return generatedCode;
  }
}

// Export additional types for better TypeScript support
export type GeneratedCode = string;

export interface GeneratorResult {
  code: GeneratedCode;
  language: 'typescript';
  framework: 'react';
}

// import { ProjectGenerator } from './project-generator-sdk';

// Initialize the generator with your Together AI API key
const generator = new ProjectGenerator({
  togetherApiKey: 'your-together-api-key',
  temperature: 0.7, // Optional: control randomness (0-1)
  maxTokens: 2048,  // Optional: maximum length of generated code
});

// Example 1: Basic usage - generate code without streaming
async function generateSimpleApp() {
  try {
    const code = await generator.generateCode({
      prompt: 'Build me a calculator app',
    });
    console.log('Generated code:', code);
  } catch (error) {
    console.error('Error generating code:', error);
  }
}

// Example 2: Generate code with streaming updates
async function generateComplexAppWithStreaming() {
  try {
    const code = await generator.generateCode({
      prompt: 'Build me a task management app with drag and drop functionality',
      stream: true,
      onProgress: (partialCode) => {
        console.log('Code generation in progress:', partialCode);
        // Update your UI here with the partial code
      },
    });
    console.log('Final generated code:', code);
  } catch (error) {
    console.error('Error generating code:', error);
  }
}

// import { Sandpack } from '@codesandbox/sandpack-react';
// function CodePreview({ code }: { code: string }) {
//   return (
//     <Sandpack
//       template="react-ts"
//       files={{
//         "App.tsx": code,
//       }}
//     />
//   );
// }