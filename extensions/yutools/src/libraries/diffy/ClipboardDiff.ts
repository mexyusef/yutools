import * as vscode from 'vscode';

export function register_clipboard_diff_old(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.diff.applyClipboardDiff', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
      }

      // Read clipboard content
      const clipboardContent = await vscode.env.clipboard.readText();
      if (!clipboardContent) {
        vscode.window.showErrorMessage('Clipboard is empty.');
        return;
      }

      // Parse the clipboard content into removed and added lines
      const { removedLines, addedLines } = parseClipboardDiffOld(clipboardContent);

      // Apply changes to the active document
      const document = editor.document;
      const fullText = document.getText();
      const newText = applyDiff(fullText, removedLines, addedLines);

      // Replace the document content with the updated text
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
      );
      edit.replace(document.uri, fullRange, newText);
      await vscode.workspace.applyEdit(edit);

      vscode.window.showInformationMessage('Clipboard diff applied successfully.');
    })
  );
}

function parseClipboardDiffOld(clipboardContent: string): { removedLines: string[], addedLines: string[] } {
  const removedLines: string[] = [];
  const addedLines: string[] = [];

  const lines = clipboardContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('-')) {
      removedLines.push(line.slice(1).trim());
    } else if (line.startsWith('+')) {
      addedLines.push(line.slice(1).trim());
    }
  }

  return { removedLines, addedLines };
}

function applyDiff(originalText: string, removedLines: string[], addedLines: string[]): string {
  let newText = originalText;

  // Remove lines marked with '-'
  for (const line of removedLines) {
    newText = newText.replace(line, '');
  }

  // Add lines marked with '+' at the end
  for (const line of addedLines) {
    newText += `\n${line}`;
  }

  return newText;
}

export function register_clipboard_diff(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.diff.applyClipboardDiff', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
      }

      // Read clipboard content
      const clipboardContent = await vscode.env.clipboard.readText();
      if (!clipboardContent) {
        vscode.window.showErrorMessage('Clipboard is empty.');
        return;
      }

      // Parse the clipboard content into removed and added lines
      const { removedLines, addedLines } = parseClipboardDiff(clipboardContent);
      if (removedLines.length === 0 && addedLines.length === 0) {
        vscode.window.showErrorMessage('Clipboard content is not in the expected diff format.');
        return;
      }

      // Get the document and its lines
      const document = editor.document;
      const lines = document.getText().split('\n');

      // Analyze indentation of removed lines
      const indentationMap = new Map<string, string>();
      for (const line of removedLines) {
        const match = lines.find(l => l.trim() === line.trim());
        if (match) {
          const indentation = match.match(/^\s*/)?.[0] || '';
          indentationMap.set(line.trim(), indentation);
        }
      }

      // Apply indentation to added lines
      const indentedAddedLines = addedLines.map(line => {
        const trimmedLine = line.trim();
        const indentation = indentationMap.get(trimmedLine) || '';
        return indentation + trimmedLine;
      });

      // Interactive mode: Confirm each change
      const confirmedChanges = await confirmChanges(removedLines, indentedAddedLines);
      if (!confirmedChanges) {
        vscode.window.showInformationMessage('No changes applied.');
        return;
      }

      // Apply changes to the document
      await editor.edit(editBuilder => {
        const fullText = document.getText();
        let newText = fullText;

        // Remove lines marked with '-'
        for (const line of confirmedChanges.removedLines) {
          newText = newText.replace(line + '\n', '').replace(line, '');
        }

        // Add lines marked with '+' at the end
        newText += '\n' + confirmedChanges.addedLines.join('\n');

        // Replace the entire document content
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(fullText.length)
        );
        editBuilder.replace(fullRange, newText);
      });

      vscode.window.showInformationMessage('Clipboard diff applied successfully.');
    })
  );
}

function parseClipboardDiff(clipboardContent: string): { removedLines: string[], addedLines: string[] } {
  const removedLines: string[] = [];
  const addedLines: string[] = [];

  const lines = clipboardContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('-')) {
      removedLines.push(line.slice(1).trim());
    } else if (line.startsWith('+')) {
      addedLines.push(line.slice(1).trim());
    }
  }

  return { removedLines, addedLines };
}

async function confirmChanges(
  removedLines: string[],
  addedLines: string[]
): Promise<{ removedLines: string[], addedLines: string[] } | null> {
  const confirmedRemovedLines: string[] = [];
  const confirmedAddedLines: string[] = [];

  // Confirm each removed line
  for (const line of removedLines) {
    const response = await vscode.window.showQuickPick(
      [`Remove: ${line}`, 'Skip'],
      { placeHolder: `Confirm removal of line: ${line}` }
    );
    if (response === `Remove: ${line}`) {
      confirmedRemovedLines.push(line);
    }
  }

  // Confirm each added line
  for (const line of addedLines) {
    const response = await vscode.window.showQuickPick(
      [`Add: ${line}`, 'Skip'],
      { placeHolder: `Confirm addition of line: ${line}` }
    );
    if (response === `Add: ${line}`) {
      confirmedAddedLines.push(line);
    }
  }

  if (confirmedRemovedLines.length === 0 && confirmedAddedLines.length === 0) {
    return null;
  }

  return { removedLines: confirmedRemovedLines, addedLines: confirmedAddedLines };
}