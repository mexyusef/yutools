import { anthropic } from '@ai-sdk/anthropic';
import { getScreenshot, executeComputerAction } from '@/utils/computer-use';
import { generateText, streamText } from 'ai';
import { execSync } from 'child_process';

class ComputerUseWrapper {
  private computerTool;

  constructor(displayWidthPx: number, displayHeightPx: number) {
    this.computerTool = anthropic.tools.computer_20241022({
      displayWidthPx,
      displayHeightPx,
      execute: async ({ action, coordinate, text }) => {
        switch (action) {
          case 'screenshot': {
            return {
              type: 'image',
              data: getScreenshot(),
            };
          }
          default: {
            return executeComputerAction(action, coordinate, text);
          }
        }
      },
      experimental_toToolResultContent(result) {
        return typeof result === 'string'
          ? [{ type: 'text', text: result }]
          : [{ type: 'image', data: result.data, mimeType: 'image/png' }];
      },
    });
  }

  // Method to generate text with computer tools
  async generateTextWithComputerTools(prompt: string) {
    const result = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      tools: { computer: this.computerTool },
    });
    console.log(result.text);
  }

  // Method to stream text with computer tools for real-time updates
  async streamTextWithComputerTools(prompt: string) {
    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      tools: { computer: this.computerTool },
    });

    for await (const chunk of result.textStream) {
      console.log(chunk);
    }
  }

  // Method to combine multiple tools (e.g., computer, text editor, bash)
  async generateWithMultipleTools(prompt: string) {
    const bashTool = anthropic.tools.bash_20241022({
      execute: async ({ command }) => execSync(command).toString(),
    });

    const textEditorTool = anthropic.tools.textEditor_20241022({
      execute: async ({
        command,
        path,
        file_text,
        insert_line,
        new_str,
        old_str,
        view_range,
      }) => {
        switch (command) {
          case 'create':
            return this.createTextFile(path, file_text);
          case 'edit':
            return this.editTextFile(path, insert_line, new_str);
          default:
            return this.viewTextFile(path, view_range);
        }
      },
    });

    const response = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: prompt,
      tools: {
        computer: this.computerTool,
        textEditor: textEditorTool,
        bash: bashTool,
      },
    });

    console.log(response.text);
  }

  // Example method to create a text file
  private async createTextFile(path: string, text: string) {
    // Simulate creating a text file
    console.log(`Creating file at ${path} with text: ${text}`);
    return { status: 'success' };
  }

  // Example method to edit a text file
  private async editTextFile(path: string, insert_line: number, new_str: string) {
    // Simulate editing a text file
    console.log(`Editing file at ${path}, inserting "${new_str}" at line ${insert_line}`);
    return { status: 'success' };
  }

  // Example method to view a text file
  private async viewTextFile(path: string, range: { start: number; end: number }) {
    // Simulate viewing a text file
    console.log(`Viewing file at ${path}, range: ${range.start} to ${range.end}`);
    return { status: 'success', data: 'File content' };
  }
}

// Example usage
const computerUse = new ComputerUseWrapper(1920, 1080);

// Generate text with computer tool
computerUse.generateTextWithComputerTools("Move the cursor to the center of the screen and take a screenshot");

// Stream text with real-time updates
computerUse.streamTextWithComputerTools("Open the browser and navigate to vercel.com");

// Combine multiple tools for complex workflows
computerUse.generateWithMultipleTools("Create a new file called example.txt, write 'Hello World' to it, and run 'cat example.txt' in the terminal");

// more: https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling
