import * as vscode from 'vscode';
// import * as fs from 'fs';
// import * as path from 'path';
// import { HuggingFaceClient } from './ImageVision';
import { generateImage } from './vision-commands/generateImage';
import { imageToText } from './vision-commands/imageToText';
import { transformImage } from './vision-commands/transformImage';
import { visualQuestionAnswering } from './vision-commands/visualQuestionAnswering';
import { documentQuestionAnswering } from './vision-commands/documentQuestionAnswering';

export function register_image_vision_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(generateImage); // yutools.llm.huggingface.generateImage
  context.subscriptions.push(imageToText); // yutools.llm.huggingface.imageToText
  context.subscriptions.push(transformImage); // yutools.llm.huggingface.transformImage
  context.subscriptions.push(visualQuestionAnswering); // yutools.llm.huggingface.visualQuestionAnswering
  context.subscriptions.push(documentQuestionAnswering); // yutools.llm.huggingface.documentQuestionAnswering
}
