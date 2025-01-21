import { window } from "vscode";
import { GenerativeAI } from "./generativeAI";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";

export async function textGenTextOnlyPrompt() {
  const genAI = new GenerativeAI();

  // Show an input box to the user to enter a custom prompt
  const userPrompt = await window.showInputBox({
    prompt: "Enter a prompt (or press Enter to use the default):",
    placeHolder: "Write a story about a magic backpack.",
  });

  // Use the default prompt if the user presses Enter without typing anything
  const prompt = userPrompt || "Write a story about a magic backpack.";

  const result = await genAI.generateText(prompt);
  // window.showInformationMessage(result);
  EditorInserter.insertTextInNewEditor(result).catch(console.error);
}
