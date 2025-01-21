import * as vscode from "vscode";

export class EditorInserter {
  /**
   * Inserts text at the current cursor position in the active editor.
   * @param text - The text to insert.
   * @throws Error if no active editor is found.
   */
  static async insertTextAtCursor(text: string): Promise<void> {
    const editor = this.getActiveEditor();
    const position = editor.selection.active;
    await this.insertText(editor, position, text);
  }

  /**
   * Opens a new untitled editor to the right of the current active editor and inserts text.
   * @param text - The text to insert into the new editor.
   * @throws Error if the new editor cannot be opened.
   */
  // static async insertTextInNewEditor(text: string): Promise<void> {
  //   const document = await vscode.workspace.openTextDocument({ content: "" });
  //   const editor = await this.showDocumentInNewEditor(document);
  //   await this.insertText(editor, new vscode.Position(0, 0), text);
  // }
  static async insertTextInNewEditor(
    text: string,
    openBeside: boolean = true
  ): Promise<void> {
    const document = await vscode.workspace.openTextDocument({ content: "" });

    // Determine the view column based on the `openBeside` parameter
    const viewColumn = openBeside
      ? vscode.ViewColumn.Beside // Open beside the current active editor
      : vscode.ViewColumn.One;   // Open in the first column

    const editor = await this.showDocumentInNewEditor(document, viewColumn);
    await this.insertText(editor, new vscode.Position(0, 0), text);
  }

  /**
   * Creates a new temporary file in the system's temporary directory, inserts text, and opens it in a new editor.
   * @param text - The text to insert into the temporary file.
   * @param fileName - Optional name for the temporary file (default: "tempFile.ts").
   * @throws Error if the temporary file cannot be created or opened.
   */
  static async insertTextInTempFile(text: string, fileName: string = "tempFile.ts"): Promise<void> {
    const tempFilePath = this.getTempFilePath(fileName);
    await this.writeToFile(tempFilePath, text);

    const document = await vscode.workspace.openTextDocument(tempFilePath);
    const editor = await this.showDocumentInNewEditor(document);
    await this.insertText(editor, new vscode.Position(0, 0), text);
  }

  /**
   * Gets the active editor.
   * @throws Error if no active editor is found.
   */
  private static getActiveEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      throw new Error("No active editor found.");
    }
    return editor;
  }

  /**
   * Inserts text at a specific position in the given editor.
   * @param editor - The editor where the text will be inserted.
   * @param position - The position at which to insert the text.
   * @param text - The text to insert.
   * @throws Error if the text cannot be inserted.
   */
  private static async insertText(
    editor: vscode.TextEditor,
    position: vscode.Position,
    text: string
  ): Promise<void> {
    const success = await editor.edit(editBuilder => {
      editBuilder.insert(position, text);
    });

    if (!success) {
      throw new Error("Failed to insert text.");
    }
  }

  /**
   * Shows a document in a new editor to the right of the active editor.
   * @param document - The document to show.
   * @throws Error if the document cannot be opened.
   */
  private static async showDocumentInNewEditor(
    document: vscode.TextDocument,
    viewColumn: vscode.ViewColumn = vscode.ViewColumn.Beside
  ): Promise<vscode.TextEditor> {
    const editor = await vscode.window.showTextDocument(document, {
      viewColumn, // Use the provided view column
      preserveFocus: false,
      preview: false,
    });
  
    if (!editor) {
      throw new Error("Failed to open the new editor.");
    }
    return editor;
  }

  /**
   * Writes text to a file.
   * @param filePath - The path of the file to write to.
   * @param text - The text to write.
   * @throws Error if the file cannot be written.
   */
  private static async writeToFile(filePath: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      require("fs").writeFile(filePath, text, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(new Error(`Failed to write to file: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Generates a path for a temporary file.
   * @param fileName - The name of the temporary file.
   */
  private static getTempFilePath(fileName: string): string {
    const tempDir = require("os").tmpdir();
    return require("path").join(tempDir, fileName);
  }

  /**
   * Streams text into the active editor in real-time.
   * @param stream - An asynchronous iterable that yields chunks of text.
   * @param openBeside - Whether to open a new editor beside the current active editor.
   * @throws Error if no active editor is found or streaming fails.
   */
  static async streamTextIntoEditor(
    stream: AsyncIterable<string>,
    openBeside: boolean = true
  ): Promise<void> {
    const document = await vscode.workspace.openTextDocument({ content: "" });
    const viewColumn = openBeside ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
    const editor = await this.showDocumentInNewEditor(document, viewColumn);

    // Insert text chunks into the editor as they arrive
    for await (const chunk of stream) {
      await this.insertText(editor, new vscode.Position(editor.document.lineCount, 0), chunk);
    }
  }

}

// // Insert at cursor
// EditorInserter.insertTextAtCursor(codeSnippet).catch(console.error);
// // Insert in new untitled editor
// EditorInserter.insertTextInNewEditor(codeSnippet).catch(console.error);
// // Insert in new temporary file
// EditorInserter.insertTextInTempFile(codeSnippet, "tempCodeSnippet.ts").catch(console.error);

// export function activate(context: vscode.ExtensionContext) {
//   // Command to insert text at the current cursor position
//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.insertAtCursor", async () => {
//       const text = await vscode.window.showInputBox({ prompt: "Enter text to insert at cursor" });
//       if (text !== undefined) {
//         EditorInserter.insertTextAtCursor(text);
//       }
//     })
//   );

//   // Command to insert text in a new editor beside the current one
//   context.subscriptions.push(
//     vscode.commands.registerCommand("extension.insertInNewEditor", async () => {
//       const text = await vscode.window.showInputBox({ prompt: "Enter text to insert in new editor" });
//       if (text !== undefined) {
//         EditorInserter.insertTextInNewEditor(text);
//       }
//     })
//   );
// }

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { EditorInserter } from "./EditorInserter";
// // Initialize the Google Generative AI model
// const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// // Function to generate and stream text into the editor
// async function generateAndStreamText(prompt: string): Promise<void> {
//   const result = await model.generateContentStream(prompt);

//   // Convert the stream into an AsyncIterable<string>
//   const textStream = (async function* () {
//     for await (const chunk of result.stream) {
//       yield chunk.text();
//     }
//   })();
//   // Stream the text into the editor
//   await EditorInserter.streamTextIntoEditor(textStream, true);
// }
// // Example usage
// generateAndStreamText("Explain the concept of quantum computing in simple terms.")
//   .catch(console.error);
