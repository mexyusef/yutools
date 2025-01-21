import vscode from 'vscode';
import { ESLint } from 'eslint';

// npm install eslint --save-dev
// .eslintrc.js
// module.exports = {
//   parserOptions: {
//     ecmaVersion: 2020,
//     sourceType: 'module',
//   },
//   rules: {
//     'no-undef': 'error', // Detect undefined variables like `fs`
//   },
// };
export const applyEslintFixes = vscode.commands.registerCommand('yutools.errors.applyEslintFixes', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const document = editor.document;

  // Initialize ESLint
  const eslint = new ESLint({ fix: true });

  try {
    // Lint the document
    const results = await eslint.lintText(document.getText(), { filePath: document.fileName });

    // Apply fixes if available
    if (results[0] && results[0].output) {
      const fixedText = results[0].output;
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      // Replace the document with the fixed text
      await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, fixedText);
      });

      vscode.window.showInformationMessage('Applied all ESLint fixes.');
    } else {
      vscode.window.showInformationMessage('No ESLint fixes available.');
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`ESLint error: ${error.message}`);
  }
});
