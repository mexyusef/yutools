import * as vscode from 'vscode';
import axios from 'axios'; // For making HTTP requests to the LLM API
import { openaiSettings } from '@/libraries/ai/config';

export function register_diff_apply_openai(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('yutools.errors.diff.fixErrorsOpenAI', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found.');
      return;
    }

    const document = editor.document;
    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    if (diagnostics.length === 0) {
      vscode.window.showInformationMessage('No errors found in the active editor.');
      return;
    }

    // Process each error
    for (const error of diagnostics) {
      const line = document.lineAt(error.range.start.line).text;
      const content = document.getText();

      // Construct the prompt
      const prompt = `
You are a helpful code assistant. Below is a code snippet with an error. Your task is to fix the error and provide the changes in a **unified diff format** that can be applied programmatically. Follow these steps:

1. Identify the error in the code.
2. Fix the error.
3. Provide the changes in a **unified diff format** that can be applied to the file.

Here is the error and code:

**Error:** ${error.message}
**Line causing the error:** ${line}
**Code:**
\`\`\`
${content}
\`\`\`

Provide the changes in the following format:
\`\`\`
--- Original
+++ Fixed
@@ -{line_number},{line_count} +{line_number},{line_count} @@
- {original_line}
+ {fixed_line}
\`\`\`

Example:
\`\`\`
--- Original
+++ Fixed
@@ -5,1 +5,1 @@
- console.log("Hello, world!")
+ console.log("Hello, world!");
\`\`\`

Now, fix the error and provide the changes in the unified diff format.
`;

      try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
          // model: 'text-davinci-003', // or any other model
          model: openaiSettings.getConfig().model,
          prompt: prompt,
          // max_tokens: 150
        }, {
          headers: {
            'Authorization': `Bearer ${openaiSettings.getNextProvider().key}`,
            'Content-Type': 'application/json'
          }
        });

        const suggestedDiff = response.data.choices[0].text.trim();

        // Show the suggested diff and ask the user to apply it
        const applyChanges = await vscode.window.showInformationMessage(
          `Apply suggested fix for error: ${error.message}?`,
          'Apply',
          'Reject',
          'Skip All'
        );

        if (applyChanges === 'Apply') {
          // Parse the diff and apply it (you might need a library like `diff` for this)
          // For simplicity, this example assumes the LLM returns a valid diff
          const edit = new vscode.WorkspaceEdit();
          const lines = suggestedDiff.split('\n');
          const lineNumber = parseInt(lines[2].split(' ')[1].split(',')[0].slice(1), 10) - 1; // Extract line number from diff
          const fixedLine = lines[4].slice(2); // Extract the fixed line
          edit.replace(document.uri, new vscode.Range(lineNumber, 0, lineNumber, line.length), fixedLine);
          vscode.workspace.applyEdit(edit);
        } else if (applyChanges === 'Skip All') {
          break; // Stop processing further errors
        }
      } catch (error) {
        vscode.window.showErrorMessage('Failed to get a fix from the LLM.');
      }
    }
  });

  context.subscriptions.push(disposable);
}
