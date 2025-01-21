import { window } from "vscode";
import { GenerativeAI } from "./generativeAI";
import { fileToGenerativePart } from "./utils";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";
import { prompt_image } from "./prompt_image";

export async function textGenMultimodalOneImagePrompt(imagePath: string) {
  const genAI = new GenerativeAI();

  // Show an input box to the user to enter a custom prompt
  const userPrompt = await window.showInputBox({
    prompt: "Enter a prompt (or press Enter to use the default):",
    placeHolder: prompt_image,
  });

  // Use the default prompt if the user presses Enter without typing anything
  const prompt = userPrompt || prompt_image;

  const imagePart = fileToGenerativePart(imagePath, "image/jpeg");
  const result = await genAI.generateMultimodalContent({ prompt, parts: [imagePart] });
  // C:\ai\yuagent\extensions\yutools\src\libraries\client\editors\editor_inserter.ts
  // window.showInformationMessage(result);
  EditorInserter.insertTextInNewEditor(result).catch(console.error);
}