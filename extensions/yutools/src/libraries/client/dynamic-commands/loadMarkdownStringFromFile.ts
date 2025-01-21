import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// Function to load Markdown content from a file and create a MarkdownString
// Example: Use the MarkdownString in a tooltip or hover provider
// const markdownFilePath = path.join(context.extensionPath, "openFile.md");
// const markdownString = loadMarkdownStringFromFile(markdownFilePath);

// if (markdownString) {
//   // Example: Show the MarkdownString in a tooltip
//   vscode.window.showInformationMessage(
//     "Click the link to open the file",
//     markdownString
//   );

//   // Example: Use the MarkdownString in a hover provider
//   const hoverProvider: vscode.HoverProvider = {
//     provideHover(document, position, token) {
//       return new vscode.Hover(markdownString);
//     },
//   };
//   vscode.languages.registerHoverProvider("*", hoverProvider);
// }
export function loadMarkdownStringFromFile(
  filePath: string
): vscode.MarkdownString | undefined {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const markdownString = new vscode.MarkdownString(content);
    markdownString.isTrusted = true; // Enable command execution
    return markdownString;
  } catch (err: any) {
    vscode.window.showErrorMessage(
      `Failed to read Markdown file: ${err.message}`
    );
    return undefined;
  }
}