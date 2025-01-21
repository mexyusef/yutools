// import * as vscode from 'vscode';
import { GroqVisionClient } from './GroqVisionClient';
import { groqSettings } from '../config';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';
import { prompt_image_simple } from '../gemini/multimodal/prompt_image';

export async function analyzeImage(
  imageSource: { type: 'file' | 'url' | 'clipboard'; data: string },
  prompt: string = prompt_image_simple,
  // outputToConsole: boolean = false,
  // outputChannel?: vscode.OutputChannel
): Promise<string> {
  try {
    let imageData: string;

    // Step 1: Get the image data based on the source type
    if (imageSource.type === 'file') {
      const fs = require('fs');
      imageData = fs.readFileSync(imageSource.data, { encoding: 'base64' });
    } else if (imageSource.type === 'url') {
      const axios = require('axios');
      const response = await axios.get(imageSource.data, { responseType: 'arraybuffer' });
      imageData = Buffer.from(response.data, 'binary').toString('base64');
    } else if (imageSource.type === 'clipboard') {
      // Assuming clipboard contains image data as base64
      // assumes that the clipboard type provides a base64-encoded string (prefixed with data:image/png;base64,).
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
      imageData = imageSource.data;
    } else {
      throw new Error('Invalid image source type');
    }

    // Step 2: Initialize the GroqVisionClient
    const client = new GroqVisionClient();

    // Step 3: Analyze the image
    const model = groqSettings.getConfig().visionModel as string;
    const result = await client.analyzeImage(
      { type: "base64", data: imageData },
      prompt,
      model
    );

    // // Step 4: Output the result
    // if (outputToConsole) {
    //   console.log("Image Analysis Result:", result);
    // } else if (outputChannel) {
    //   outputChannel.clear();
    //   outputChannel.appendLine("Image Analysis Result:");
    //   outputChannel.appendLine(result);
    //   outputChannel.show();
    // }
    EditorInserter.insertTextInNewEditor(result);

    return result;
  } catch (error: any) {
    throw new Error(`Error analyzing image: ${error.message}`);
  }
}
