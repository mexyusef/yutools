import * as vscode from "vscode";
import { textGenMultimodalOneImagePrompt } from "./textGenMultimodalOneImagePrompt";
import { createCache, getCache, deleteCache } from "./cacheCommands";
import { textGenTextOnlyPrompt } from "./textGenTextOnlyPrompt";
import { textGenTextOnlyPromptStreaming } from "./textGenTextOnlyPromptStreaming";
import { executeCode, executeCodeInChat } from "./codeExecutionCommands";
import { startChatWithImages } from "./startChatWithImages";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.llm.multimodal.textGenTextOnlyPrompt", () => textGenTextOnlyPrompt()),
    vscode.commands.registerCommand("yutools.llm.multimodal.textGenTextOnlyPromptStreaming", () => textGenTextOnlyPromptStreaming()),
    vscode.commands.registerCommand("yutools.llm.multimodal.textGenMultimodalOneImagePrompt", async () => {
      // const imagePath = vscode.workspace.getConfiguration().get("generativeAI.imagePath");
      const imagePath = await vscode.window.showInputBox({
        prompt: "Enter the path to the image:",
        placeHolder: "/path/to/image.jpg",
      });
      // const imagePath = imagePath || "/path/to/image";
      if (imagePath) {
        textGenMultimodalOneImagePrompt(imagePath as string);
      } else {
        vscode.window.showErrorMessage("Image path is not configured.");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.llm.multimodal.createCache", createCache),
    vscode.commands.registerCommand("yutools.llm.multimodal.getCache", getCache),
    vscode.commands.registerCommand("yutools.llm.multimodal.deleteCache", deleteCache)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.llm.multimodal.executeCode", executeCode),
    vscode.commands.registerCommand("yutools.llm.multimodal.executeCodeInChat", executeCodeInChat)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.llm.multimodal.startChatWithImages", startChatWithImages),
    // vscode.commands.registerCommand("yutools.llm.multimodal.callFunction", callFunction),
  );

}