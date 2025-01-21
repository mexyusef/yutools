import * as vscode from "vscode";
import { GeminiClient } from "./geminiClient"; // Replace with the actual path to your Gemini utility
import EventEmitter from "events";

function isEventEmitter(obj: any): obj is EventEmitter {
  return typeof obj.on === "function";
}

const gemini_prompt = vscode.commands.registerCommand("yutools.gemini.prompt", async () => {
  // Show input box to get the prompt
  const userPrompt = await vscode.window.showInputBox({
    prompt: "Enter your prompt for Gemini",
  });
  if (!userPrompt) {
    vscode.window.showErrorMessage("Prompt is required!");
    return;
  }
  const gemini = new GeminiClient(
    // {
    //   model: "gemini-2",
    //   temperature: 0.8,
    //   systemPrompt: "You are a helpful assistant.",
    // }
  );
  gemini.setStreamMode(true);
  // Create an output channel for the response
  const outputChannel = vscode.window.createOutputChannel("Gemini Response");
  outputChannel.show();

  try {
    // const stream = await gemini.sendPrompt(userPrompt);
    // if (stream instanceof require("events").EventEmitter) {
    //   stream.on("data", (chunk: string) => {
    //     outputChannel.append(chunk); // Append chunk to the output channel
    //   });
    //   stream.on("end", () => {
    //     outputChannel.appendLine("\n\nStream ended.");
    //   });
    // }
    const response = await gemini.sendPrompt(userPrompt);
    if (isEventEmitter(response)) {
      // Handle streaming response
      response.on("data", (chunk: string) => {
        outputChannel.append(chunk); // Append chunk to the output channel
      });
      response.on("end", () => {
        outputChannel.appendLine("\n\nStream ended.");
      });
    } else {
      // Handle non-streaming response
      outputChannel.appendLine(`Response: ${response.content}`);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
});

export function register_gemini_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(gemini_prompt);
}
