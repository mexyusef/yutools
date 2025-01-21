import * as vscode from "vscode";
import { createImageContentFromLocalFile } from "./createImageContentFromLocalFile";
import { prompt_image_simple } from "../gemini/multimodal/prompt_image";
import { vision_chat } from "./VisionAPI";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";

export async function describeLocalImage() {
  // const prompt = `You are a UX/UI designer. Describe the attached screenshot.`;
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      Images: ["png", "jpg", "jpeg"],
    },
  });

  if (!fileUri || fileUri.length === 0) {
    vscode.window.showErrorMessage("Image file is required.");
    return;
  }

  const filePath = fileUri[0].fsPath;
  const localImageContent = createImageContentFromLocalFile(filePath);

  // // coba default bisa gak
  // await vision_chat.generateDescription(
  //   prompt_image_simple,
  //   localImageContent,
  //   (chunk) => {
  //     vscode.window.showInformationMessage(chunk);
  //   }
  // );
  // C:\ai\yuagent\extensions\yutools\generated_images\who_am_i.png
  // Create a new untitled text editor
  const document = await vscode.workspace.openTextDocument({ content: "" });
  const editor = await vscode.window.showTextDocument(document, {
    viewColumn: vscode.ViewColumn.Beside, // Open beside the current editor
    preview: false,
  });
  // Stream the description into the new editor
  await vision_chat.generateDescription(
    prompt_image_simple,
    localImageContent,
    (chunk) => {
      // Insert each chunk into the editor
      const position = new vscode.Position(editor.document.lineCount, 0);
      editor.edit((editBuilder) => {
        editBuilder.insert(position, chunk);
      });
    }
  );
  // // Create an async iterable to stream the chunks
  // const stream = (async function* () {
  //   await vision_chat.generateDescription(
  //     prompt_image_simple,
  //     localImageContent,
  //     (chunk) => {
  //       // Yield each chunk to the stream
  //       yield chunk;
  //     }
  //   );
  // })();

  // // // Stream the text into a new editor
  // // await EditorInserter.streamTextIntoEditor(stream);
  // // Create an async generator function to stream the chunks
  // async function* createStream() {
  //   let resolveChunk: (chunk: string) => void;
  //   let chunkPromise = new Promise<string>((resolve) => {
  //     resolveChunk = resolve;
  //   });

  //   await vision_chat.generateDescription(
  //     prompt_image_simple,
  //     localImageContent,
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
