import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// import axios from 'axios';

export const stringToLowerCase = (str: string): string => {
  return str.toLowerCase();
};

export function getFolder(itemPath: string): string {
  // Check if the item is a directory
  if (fs.existsSync(itemPath) && fs.lstatSync(itemPath).isDirectory()) {
    return itemPath;
  }

  // If the item is a file, return its containing directory
  return path.dirname(itemPath);
}

// typescript function that receives a text and a variable number of key value where any given key within the text should be replaced by the value associated with it
// ```typescript
export function replaceKeys(text: string, ...keyValuePairs: [string, string][]) {
  // Create a map from the key-value pairs
  const replacements = new Map(keyValuePairs);

  // Replace each key in the text with its corresponding value
  let result = text;
  for (const [key, value] of replacements) {
    // result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}

// // Example usage
// const text = "Hello {{name}}, welcome to {{company}}!";
// const name = "John Doe";
// const company = "Acme Corp";
// const replacedText = replaceKeys(text, ["name", name], ["company", company]);
// console.log(replacedText); // Output: Hello John Doe, welcome to Acme Corp!

// ```
// **Explanation:**

// 1. **Function Definition:**
//    - `replaceKeys(text: string, ...keyValuePairs: [string, string][])`:
//      - Takes a `text` string as the first argument.
//      - Accepts a variable number of key-value pairs using the rest parameter `...keyValuePairs`. Each pair is an array of `[string, string]`.

// 2. **Creating a Map:**
//    - `const replacements = new Map(keyValuePairs);`:
//      - Creates a `Map` object from the provided key-value pairs. This allows for efficient key-value lookup.

// 3. **Replacing Keys:**
//    - `let result = text;`: Initializes a `result` variable with the original text.
//    - `for (const [key, value] of replacements) { ... }`: Iterates through each key-value pair in the `replacements` map.
//      - `result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);`:
//        - Uses `replace` to replace all occurrences of the key enclosed in double curly braces (`{{key}}`) with the corresponding `value`.
//        - The `g` flag in the regular expression ensures global replacement (all occurrences).

// 4. **Returning the Result:**
//    - `return result;`: Returns the modified text with all keys replaced.

// **Example Usage:**

// - The example demonstrates how to use the `replaceKeys` function with a text string and key-value pairs.
// - The output shows the text with the keys `{{name}}` and `{{company}}` replaced with their respective values.

export function generateRandomId(): string {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

export function isImageFile(filePath: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
  return imageExtensions.includes(path.extname(filePath).toLowerCase());
}

export function isImageURL(url: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
  const ext = path.extname(url.toLowerCase());
  return imageExtensions.includes(ext);
}

// const { prompt, context } = await getPromptAndContext();
// const { prompt: newContent, context } = await getPromptAndContext();
// gagal => { prompt: undefined, context: '' } => if (prompt === undefined) { return; }
export async function getPromptAndContext(
  previousLines = 1, // hanya 1 baris sebelum current line sebagai context
  ask_if_empty = true,
): Promise<{ prompt: string | undefined; context: string }> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No active text editor');
    return { prompt: undefined, context: '' };
  }

  const selection = editor.selection;
  let prompt: string | undefined;
  let currentLine: number;

  if (!selection.isEmpty) {
    prompt = editor.document.getText(selection);
    currentLine = selection.active.line;
  } else {
    currentLine = selection.active.line;
    const line = editor.document.lineAt(currentLine).text;
    if (line.trim()) {
      prompt = line;
    }
  }

  if (!prompt && ask_if_empty) {
    prompt = await vscode.window.showInputBox({
      prompt: 'Enter your query',
      placeHolder: 'Type your query here...',
    });
  }

  if (prompt) {
    const context = editor.document
      .getText()
      .split('\n')
      .slice(Math.max(0, currentLine - previousLines), currentLine)
      .join('\n');

    return { prompt, context };
  }

  return { prompt: undefined, context: '' };
}

function getActiveEditor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found.");
    throw new Error("No active text editor found.");
  }
  return editor;
}

function getEditorPositions(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  const startPosition = selection.isEmpty ? selection.active : selection.end;
  const currentLine = document.lineAt(startPosition);
  const lineStart = currentLine.range.start;
  const lineEnd = currentLine.range.end;

  return { startPosition, lineStart, lineEnd, selection };
}

function handleEditorEdit(editor: vscode.TextEditor, editCallback: (editBuilder: vscode.TextEditorEdit) => void) {
  editor.edit(editCallback).then(success => {
    if (!success) {
      vscode.window.showErrorMessage("Failed to edit the document.");
    }
  });
}

export function insertTextInEditor(text: string, replace = false, pemisah = '\n\n') {
  try {
    const editor = getActiveEditor();
    const { startPosition, lineStart, lineEnd, selection } = getEditorPositions(editor);

    handleEditorEdit(editor, editBuilder => {
      if (replace) {
        if (selection.isEmpty && text.trim().length > 0) {
          const newSelection = new vscode.Selection(lineStart, lineEnd);
          editBuilder.replace(newSelection, text);
        } else {
          editBuilder.replace(selection, text);
        }
      } else {
        editBuilder.insert(lineEnd, `${pemisah}${text}`);
      }

      const newCursorPos = new vscode.Selection(lineEnd, lineEnd);
      editor.selection = newCursorPos;
    });
  } catch (error: any) {
    console.error(error.message);
  }
}

export function replaceTextInEditor(text: string, replace = true) {
  try {
    const editor = getActiveEditor();
    const { startPosition, lineEnd, selection } = getEditorPositions(editor);

    const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
    const wordStart = wordRange ? wordRange.start : selection.start;
    const wordEnd = wordRange ? wordRange.end : lineEnd;

    handleEditorEdit(editor, editBuilder => {
      if (replace) {
        if (selection.isEmpty && text.trim().length > 0) {
          const newSelection = new vscode.Selection(wordStart, wordEnd);
          editBuilder.replace(newSelection, text);
        } else {
          editBuilder.replace(selection, text);
        }
      }
    });
  } catch (error: any) {
    console.error(error.message);
  }
}

// Function to handle progress bar
export async function showProgressBar(title: string, mainLogic: () => Promise<void>) {
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: title,
    cancellable: false
  }, async (progress) => {
    // Indicate progress
    progress.report({ increment: 0 });

    // Execute main logic
    await mainLogic();

    // Report completion
    progress.report({ increment: 100 });
  });
}

// async function main() {
//     await showProgressBar("Hold your (high) horses...", async () => {
//         // Your main logic here
//         // Example:
//         await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating some async work
//         console.log("Main logic executed");
//     });
// }

/**
 * Function to override a file with new content while creating a backup of the original file.
 * @param filePath The path to the file to override.
 * @param newContent The new content to write to the file.
 * @returns True if the override was successful, false otherwise.
 */
export function overrideFileWithBackup(filePath: string, newContent: string): boolean {
  try {
    // Ensure the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
      return false;
    }

    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    const backupPath = `${filePath}.${timestamp}.bak`;

    // Read existing file content
    const currentContent = fs.readFileSync(filePath, 'utf-8');

    // Backup current file with timestamp
    fs.writeFileSync(backupPath, currentContent);

    // Write new content to the file
    fs.writeFileSync(filePath, newContent);

    vscode.window.showInformationMessage(`${path.basename(filePath)} overridden successfully.`);
    return true;
  } catch (error: any) {
    console.error(`Failed to override ${filePath}:`, error);
    vscode.window.showErrorMessage(`Failed to override ${filePath}: ${error.message}`);
    return false;
  }
}
