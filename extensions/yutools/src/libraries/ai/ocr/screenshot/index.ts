import * as screenshot from 'screenshot-desktop';
import robot from 'robotjs';
import sharp from 'sharp';
import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';

/**
 * Captures the entire screen and saves it to a file.
 * @param filename The output file path.
 */
export async function captureFullScreen(filename: string): Promise<string> {
  try {
    const imgBuffer = await screenshot({ format: 'png' });
    await sharp(imgBuffer).toFile(filename);
    return filename;
  } catch (error) {
    throw new Error(`Failed to capture screen: ${error}`);
  }
}

/**
 * Captures a selected region of the screen and saves it to a file.
 * @param filename The output file path.
 */
export async function captureSelectedRegion(filename: string): Promise<string> {
  try {
    // Prompt the user to select a region
    await vscode.window.showInformationMessage('Select a region on the screen...');

    // Get the starting point of the selection
    const startPos = robot.getMousePos();
    const startX = startPos.x;
    const startY = startPos.y;

    // Wait for the user to release the mouse button
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!robot.getMouseButtons().left) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    // Get the end point of the selection
    const endPos = robot.getMousePos();
    const endX = endPos.x;
    const endY = endPos.y;

    // Capture the screen and crop the selected region
    const imgBuffer = await screenshot({ format: 'png' });
    await sharp(imgBuffer)
      .extract({
        left: Math.min(startX, endX),
        top: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
      })
      .toFile(filename);

    return filename;
  } catch (error) {
    throw new Error(`Failed to capture selected region: ${error}`);
  }
}