import vscode from "vscode";

import { EditorInserter } from "@/libraries/client/editors/editor_inserter";
import { GeminiMultimodal } from "./GeminiMultimodal";
import { textGenMultimodalOneImagePromptCommand } from "../multimodal/multimodal_commands";
// import fs from "fs";
// import path from "path";
// import {
//   canCopyImagesToClipboard,
//   requestClipboardWritePermission,
//   copyBlobToClipboard,
//   getBlobFromImageSource,
//   convertBlobToPng,
//   getBlobFromImageElement,
// } from "copy-image-clipboard";
// import { GenerativePart } from "./GenerativePart";

// async function createInlineDataObjectFromClipboard(imagePath: string) {
//   // Step 1: Check if clipboard supports image operations.
//   if (!canCopyImagesToClipboard()) {
//     const permission = await requestClipboardWritePermission();
//     if (!permission) {
//       throw new Error("Clipboard write permission denied.");
//     }
//   }

//   // Step 2: Use APIs to retrieve and process the clipboard image.
//   const imageBlob: Blob = await getBlobFromImageSource(imagePath);

//   // Step 3: Convert the image Blob to PNG (optional for consistent format).
//   const pngBlob = await convertBlobToPng(imageBlob);

//   // Step 4: Convert Blob to ArrayBuffer.
//   const arrayBuffer = await pngBlob.arrayBuffer();

//   // Step 5: Encode the ArrayBuffer to Base64.
//   const base64Data = Buffer.from(new Uint8Array(arrayBuffer)).toString("base64");

//   // Step 6: Determine MIME type.
//   const mimeType = pngBlob.type || "image/png";

//   // Step 7: Prepare the `inlineData` object.
//   const inlineDataObject = {
//     inlineData: {
//       data: base64Data,
//       mimeType,
//     },
//   };
//   console.log("Prepared Object:", inlineDataObject);
//   return inlineDataObject;
// }

// // // Example usage with a clipboard-sourced image file path.
// // (async () => {
// //   const imagePath = path.resolve(__dirname, 'clipboard-image.png'); // Replace with actual logic for image source.
// //   const data = await createInlineDataObjectFromClipboard(imagePath);
// //   console.log("Inline Data Object for Gemini:", data);
// // })();

// // Helper function to convert a file into a generative part
// function fileToGenerativePart(filePath: string, mimeType: string): GenerativePart {
//   const fileData = fs.readFileSync(filePath);
//   return {
//     inlineData: {
//       data: Buffer.from(fileData).toString("base64"),
//       mimeType,
//     },
//   };
// }

// // Helper function to convert a clipboard image blob into a generative part
// async function clipboardToGenerativePart(mimeType: string): Promise<GenerativePart> {
//   const imageElement = document.createElement("img");
//   imageElement.src = "clipboard-image-placeholder"; // Placeholder for clipboard handling setup

//   const blob = await getBlobFromImageElement(imageElement);
//   const data = await blob.arrayBuffer();

//   return {
//     inlineData: {
//       data: Buffer.from(data).toString("base64"),
//       mimeType,
//     },
//   };
// }
const generateFromFileDialog = vscode.commands.registerCommand("yutools.multimodal.gemini.generateFromFileDialog", async () => {
  try {
    const gemini = new GeminiMultimodal();
    const response = await gemini.generateFromFileDialog();
    // vscode.window.showInformationMessage("Generated Response: " + response);
    EditorInserter.insertTextInNewEditor(response);
  } catch (error: any) {
    vscode.window.showErrorMessage("Error: " + error.message);
  }
});

const generateFromClipboard = vscode.commands.registerCommand("yutools.multimodal.gemini.generateFromClipboard", async () => {
  try {
    const gemini = new GeminiMultimodal();
    const default_prompt = "What does this image depict?";
    const response = await gemini.generateFromClipboard(
      await vscode.window.showInputBox({
        prompt: "Enter your prompt for the clipboard image (Press Enter to use default)",
        value: default_prompt,
      }) || default_prompt,
      "image/png"
    );
    // vscode.window.showInformationMessage("Generated Response: " + response);
    EditorInserter.insertTextInNewEditor(response);
  } catch (error: any) {
    vscode.window.showErrorMessage("Error: " + error.message);
  }
});

export function register_gemini_images_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(generateFromFileDialog); // yutools.multimodal.gemini.generateFromFileDialog

  context.subscriptions.push(generateFromClipboard); // yutools.multimodal.gemini.generateFromClipboard

  context.subscriptions.push(textGenMultimodalOneImagePromptCommand); // yutools.multimodal.gemini.textGenMultimodalOneImagePrompt
}

// // Example usage (to be placed in an appropriate main file or script):
// (async () => {
//   const API_KEY = process.env.API_KEY || "";

//   if (!API_KEY) {
//     console.error("API key is missing. Please set the API_KEY environment variable.");
//     process.exit(1);
//   }

//   const gemini = new GeminiMultimodal(API_KEY);

//   try {
//     // Example 1: Using a local file
//     const mediaPath = path.resolve(__dirname, "media"); // Ensure this directory exists and contains your image
//     const responseFromFile = await gemini.generateFromImage(
//       "Describe how this product might be manufactured.",
//       path.join(mediaPath, "jetpack.jpg"),
//       "image/jpeg"
//     );
//     console.log("Response from file:", responseFromFile);

//     // Example 2: Using a file dialog
//     const responseFromFileDialog = await gemini.generateFromFileDialog(
//       "Describe this product based on the image.",
//       "image/jpeg"
//     );
//     console.log("Response from file dialog:", responseFromFileDialog);

//     // Example 3: Using the clipboard
//     const responseFromClipboard = await gemini.generateFromClipboard(
//       "What does this image depict?",
//       "image/png"
//     );
//     console.log("Response from clipboard:", responseFromClipboard);

//   } catch (error: any) {
//     console.error("Error generating response:", error);
//   }
// })();
