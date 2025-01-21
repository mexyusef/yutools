import { window } from "vscode";
import { GenerativeAI } from "./generativeAI";
import fs from "fs";

const genAI = new GenerativeAI();

export async function startChatWithImages() {
  const imagePath = await window.showInputBox({
    prompt: "Enter the path to the image:",
    placeHolder: "/path/to/image.jpg",
  });

  if (!imagePath || !fs.existsSync(imagePath)) {
    window.showErrorMessage("Invalid image path.");
    return;
  }

  let mimeType = "image/jpeg";
  // let mimeType = await window.showInputBox({
  //   prompt: "Enter the MIME type of the image:",
  //   placeHolder: "image/jpeg",
  // });
  // if (!mimeType) {
  //   window.showErrorMessage("MIME type is required.");
  //   return;
  // }

  const prompt = await window.showInputBox({
    prompt: "Enter your prompt:",
    placeHolder: "What do you think about this design?",
  });

  if (!prompt) {
    window.showErrorMessage("Prompt is required.");
    return;
  }

  const chat = await genAI.startChatWithImages();
  await genAI.sendMessageWithImageStream(chat, prompt, imagePath, mimeType);
}

// Example Usage
// Start Chat with Images:
// Run the Start Chat with Images command.
// Enter the path to the image (e.g., /media/jetpack.jpg).
// Enter the MIME type of the image (e.g., image/jpeg).
// Enter a prompt like "What do you think about this design?".
// The model will respond in a streaming manner, incorporating the image into the chat.
