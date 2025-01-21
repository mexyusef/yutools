import * as vscode from "vscode";
import ImageGenerationLibrary from "./image_library";
import { EditorInserter } from "@/libraries/client/editors/editor_inserter";

const imageGenerator = new ImageGenerationLibrary();

const setDefaultSettings = vscode.commands.registerCommand("yutools.multimodal.together.setDefaultSettings", async () => {
  const model = await vscode.window.showInputBox({
    prompt: "Enter the model name",
    value: "black-forest-labs/FLUX.1-depth",
  });
  if (!model) return;

  const width = await vscode.window.showInputBox({
    prompt: "Enter the width",
    value: "1024",
  });
  const height = await vscode.window.showInputBox({
    prompt: "Enter the height",
    value: "1024",
  });
  const steps = await vscode.window.showInputBox({
    prompt: "Enter the steps",
    value: "28",
  });

  imageGenerator.setDefaultSettings({
    model,
    width: parseInt(width || "1024", 10),
    height: parseInt(height || "1024", 10),
    steps: parseInt(steps || "28", 10),
  });

  vscode.window.showInformationMessage("Default settings updated!");
});

const generateImage = vscode.commands.registerCommand("yutools.multimodal.together.generateImage", async () => {
  const prompt = await vscode.window.showInputBox({
    prompt: "Enter the prompt for the image",
  });
  if (!prompt) return;

  // Error generating image: Error: 400 {"error":{"message":"reference image is missing","type":"invalid_request_error","param":"image_url.url","code":null}}
  const imageUrl = await vscode.window.showInputBox({
    prompt: "Enter reference image URL",
  });

  // const width = await vscode.window.showInputBox({
  //   prompt: "Enter the width (or leave blank for default)",
  // });
  // const height = await vscode.window.showInputBox({
  //   prompt: "Enter the height (or leave blank for default)",
  // });
  // const steps = await vscode.window.showInputBox({
  //   prompt: "Enter the steps (or leave blank for default)",
  // });

  const imageUrlResult = await imageGenerator.generateImage(
    prompt,
    imageUrl,
    // parseInt(width || "1024", 10),
    // parseInt(height || "1024", 10),
    // parseInt(steps || "28", 10)
  );

  if (imageUrlResult) {
    EditorInserter.insertTextInNewEditor(`Image generated successfully: ${imageUrlResult}`);
    vscode.window.showInformationMessage(`Image generated successfully: ${imageUrlResult}`);
  } else {
    vscode.window.showErrorMessage("Failed to generate image.");
  }
});

const uploadImage = vscode.commands.registerCommand("yutools.multimodal.together.uploadImage", async () => {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectMany: false,
    openLabel: "Select an image file to upload",
    filters: { Images: ["png", "jpg", "jpeg"] },
  });

  if (!fileUri || fileUri.length === 0) {
    vscode.window.showErrorMessage("No file selected.");
    return;
  }

  const filePath = fileUri[0].fsPath;

  const uploadResult = await imageGenerator.uploadImage(filePath);

  if (uploadResult) {
    EditorInserter.insertTextInNewEditor(`Image uploaded successfully: ${uploadResult}`);
    vscode.window.showInformationMessage(`Image uploaded successfully: ${uploadResult}`);
  } else {
    vscode.window.showErrorMessage("Failed to upload image.");
  }
});

export function register_together_image_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(setDefaultSettings);

  context.subscriptions.push(generateImage);

  context.subscriptions.push(uploadImage);
}
