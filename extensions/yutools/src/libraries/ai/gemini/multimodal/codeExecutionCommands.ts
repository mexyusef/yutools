// src/commands/codeExecutionCommands.ts
import { window } from "vscode";
import { GenerativeAI } from "./generativeAI";

const genAI = new GenerativeAI();

export async function executeCode() {
  const prompt = await window.showInputBox({
    prompt: "Enter a prompt for code execution:",
    placeHolder: "What is the sum of the first 50 prime numbers?",
  });

  if (!prompt) {
    window.showErrorMessage("Prompt is required.");
    return;
  }

  const result = await genAI.executeCode(prompt);
  window.showInformationMessage(`Code Execution Result: ${result}`);
}

export async function executeCodeInChat() {
  const prompt = await window.showInputBox({
    prompt: "Enter a prompt for code execution in chat:",
    placeHolder: "What is the sum of the first 50 prime numbers?",
  });

  if (!prompt) {
    window.showErrorMessage("Prompt is required.");
    return;
  }

  const result = await genAI.executeCodeInChat(prompt);
  window.showInformationMessage(`Chat Code Execution Result: ${result}`);
}