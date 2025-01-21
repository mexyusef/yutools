import * as vscode from "vscode";
import { textGenMultimodalOneImagePrompt } from "./textGenMultimodalOneImagePrompt";
// import { createCache, getCache, deleteCache } from "./cacheCommands";
// import { textGenTextOnlyPrompt } from "./textGenTextOnlyPrompt";
// import { textGenTextOnlyPromptStreaming } from "./textGenTextOnlyPromptStreaming";
// import { executeCode, executeCodeInChat } from "./codeExecutionCommands";
// import { startChatWithImages } from "./startChatWithImages";

export const textGenMultimodalOneImagePromptCommand = vscode.commands.registerCommand("yutools.multimodal.gemini.textGenMultimodalOneImagePrompt", async () => {
  // const imagePath = vscode.workspace.getConfiguration().get("generativeAI.imagePath");
  // const imagePath = await vscode.window.showInputBox({
  //   prompt: "Enter the path to the image:",
  //   placeHolder: "/path/to/image.jpg",
  // });
  const fileUri = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: "Select an image",
    filters: { Images: ["jpg", "jpeg", "png"] },
  });
  if (!fileUri || fileUri.length === 0) {
    throw new Error("No file selected.");
  }
  const imagePath = fileUri[0].fsPath;
  // const imagePath = imagePath || "/path/to/image";
  if (imagePath) {
    textGenMultimodalOneImagePrompt(imagePath as string);
  } else {
    vscode.window.showErrorMessage("Image path is not configured.");
  }
})