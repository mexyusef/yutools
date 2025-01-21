import * as vscode from "vscode";
import { describeImageUrl } from "./describeImageUrl";
import { describeLocalImage } from "./describeLocalImage";

const describeImageUrlCommand = vscode.commands.registerCommand("yutools.multimodal.together.describeImageUrl", describeImageUrl);

const describeLocalImageCommand = vscode.commands.registerCommand("yutools.multimodal.together.describeLocalImage", describeLocalImage);

export function register_together_vision_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    describeImageUrlCommand,
    describeLocalImageCommand
  );
}
