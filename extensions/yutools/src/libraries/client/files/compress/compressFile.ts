import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { compressTextFile } from './compressTextFile';

/**
 * Compresses the file at the given file path.
 * 
 * @param filePath The path to the file to compress.
 */
export async function compressFile(filePath: string) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf-8');

    // Get the file extension to determine the file type
    const fileExtension = path.extname(filePath).slice(1);

    // Compress the file content
    const compressedContent = compressTextFile(content, true, fileExtension);

    // Write the compressed content back to the file
    fs.writeFileSync(filePath, compressedContent, 'utf-8');

    vscode.window.showInformationMessage(`File compressed successfully: ${filePath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to compress file: ${error}`);
  }
}