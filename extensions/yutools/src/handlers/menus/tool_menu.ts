import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { analyzeProject } from "@/tools/analyze-project";
import { processPath } from "@/tools/process-path/processPath";

function sanitizeDirPath(dirPath: string): string {
  return dirPath.replace(/[\\/:*?"<>|]/g, "_"); // Replace invalid filename characters with '_'
}

export const toolsAnalyzeProject = vscode.commands.registerCommand("yutools.toolsAnalyzeProject",
  async (uri: vscode.Uri | undefined) => {
    let dirPath: string | undefined;

    if (uri && uri.fsPath) {
      // Case 1: Directory is selected via context menu
      dirPath = uri.fsPath;
    } else {
      // Case 2: No directory selected, open a dialog for folder selection
      const selectedFolder = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Folder to Analyze",
      });

      if (selectedFolder && selectedFolder.length > 0) {
        dirPath = selectedFolder[0].fsPath;
      }
    }

    if (!dirPath) {
      vscode.window.showErrorMessage("No directory selected for analysis.");
      return;
    }

    try {
      // Call the analyzeProject function
      const result = await analyzeProject(dirPath);

      // Generate the output file path
      const sanitizedDirName = sanitizeDirPath(path.basename(dirPath));
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const outputFilePath = path.join(
        "c:\\tmp\\analyze-projects",
        `${sanitizedDirName}-${timestamp}.txt`
      );

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

      // Write the result to the file
      fs.writeFileSync(outputFilePath, result, "utf-8");

      // Open the file in the editor
      const document = await vscode.workspace.openTextDocument(outputFilePath);
      await vscode.window.showTextDocument(document);

      vscode.window.showInformationMessage(
        `Analysis completed and saved to: ${outputFilePath}`
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Failed to analyze project: ${error.message}`
      );
    }
  }
);

export const toolsProcessPath = vscode.commands.registerCommand("yutools.toolsProcessPath",
  async (uri: vscode.Uri | undefined) => {
    let dirPath: string | undefined;

    if (uri && uri.fsPath) {
      // Case 1: Directory is selected via context menu
      dirPath = uri.fsPath;
    } else {
      // Case 2: No directory selected, open a dialog for folder selection
      const selectedFolder = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Folder to Process",
      });

      if (selectedFolder && selectedFolder.length > 0) {
        dirPath = selectedFolder[0].fsPath;
      }
    }

    if (!dirPath) {
      vscode.window.showErrorMessage("No directory selected for processing.");
      return;
    }

    try {
      // Generate the output file path
      const sanitizedDirName = sanitizeDirPath(path.basename(dirPath));
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const outputFilePath = path.join(
        "c:\\tmp\\analyze-projects",
        `process-path-${sanitizedDirName}-${timestamp}.txt`
      );

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

      // Create a writable stream to use as the writer
      const writableStream = fs.createWriteStream(outputFilePath, {
        flags: "w",
      });

      // Use the writer to write the output to the file
      const writer = (content: string) => writableStream.write(content);

      // Call the processPath function with options
      await processPath(dirPath, {
        extensions: [".js", ".ts", ".py", ".tsx", ".jsx"],
        includeHidden: false,
        ignoreGitignore: true,
        ignorePatterns: ["node_modules", "*.log", "git", "__pycache__"],
        writer: writer,
        outputAsXml: false,
      });

      // Close the stream when done
      writableStream.end();

      // Wait for the 'finish' event to ensure the file is fully written
      await new Promise((resolve, reject) => {
        writableStream.on('finish', resolve);
        writableStream.on('error', reject);
      });

      // Open the file in the editor
      const document = await vscode.workspace.openTextDocument(outputFilePath);
      await vscode.window.showTextDocument(document);

      vscode.window.showInformationMessage(
        `Processing completed and saved to: ${outputFilePath}`
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Failed to process path: ${error.message}`
      );
    }
  }
);

export function register_tools_menu(context: vscode.ExtensionContext) {
	context.subscriptions.push(toolsAnalyzeProject);
	context.subscriptions.push(toolsProcessPath);
}
