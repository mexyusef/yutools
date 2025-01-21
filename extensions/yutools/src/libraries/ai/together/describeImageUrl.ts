import * as vscode from "vscode";
import { createImageContentFromUrl } from "./createImageContentFromUrl";
import { prompt_image_simple } from "../gemini/multimodal/prompt_image";
import { vision_chat } from "./VisionAPI";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";

export async function describeImageUrl() {
  // const prompt = `You are a UX/UI designer. Describe the attached screenshot.`;
  const url = await vscode.window.showInputBox({
    prompt: "Enter the image URL",
    placeHolder: "https://example.com/image.png",
  });

  if (!url) {
    vscode.window.showErrorMessage("Image URL is required.");
    return;
  }

  const imageUrlContent = createImageContentFromUrl(url);

  // await vision_chat.generateDescription(
  //   prompt_image_simple,
  //   imageUrlContent,
  //   (chunk) => {
  //     vscode.window.showInformationMessage(chunk);
  //   }
  // );
  // https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/canvas/2025/01/01/a45aeeed-221d-44e2-acd2-a3ec4712287e_9c187003.jpg
  // Create a new untitled text editor
  const document = await vscode.workspace.openTextDocument({ content: "" });
  const editor = await vscode.window.showTextDocument(document, {
    viewColumn: vscode.ViewColumn.Beside, // Open beside the current editor
    preview: false,
  });

  // Stream the description into the new editor
  await vision_chat.generateDescription(
    prompt_image_simple,
    imageUrlContent,
    (chunk) => {
      // Insert each chunk into the editor
      const position = new vscode.Position(editor.document.lineCount, 0);
      editor.edit((editBuilder) => {
        editBuilder.insert(position, chunk);
      });
    }
  );
  // async function* createStream() {
  //   let resolveChunk: (chunk: string) => void;
  //   let chunkPromise = new Promise<string>((resolve) => {
  //     resolveChunk = resolve;
  //   });

  //   await vision_chat.generateDescription(
  //     prompt_image_simple,
  //     imageUrlContent,
  //     (chunk) => {
  //       resolveChunk(chunk); // Resolve the promise with the chunk
  //     }
  //   );

  //   // Yield each chunk as it arrives
  //   while (true) {
  //     const chunk = await chunkPromise;
  //     yield chunk;

  //     // Create a new promise for the next chunk
  //     chunkPromise = new Promise<string>((resolve) => {
  //       resolveChunk = resolve;
  //     });
  //   }
  // }

  // // Stream the text into a new editor
  // await EditorInserter.streamTextIntoEditor(createStream(), true);

}