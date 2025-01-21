import vscode from 'vscode';
import ts from 'typescript';
// npm install typescript --save-dev
// Add Missing Imports: As shown earlier.
// Remove Unused Imports: Identify and remove imports that are not used in the code.
// Fix Type Errors: Detect and suggest fixes for type mismatches.
// Refactor Code: Rename symbols, extract methods, or reorganize code.
// Add Missing Properties: Detect missing properties in objects or classes.
// Fix Syntax Errors: Identify and fix syntax issues.
// Generate Code: Automatically generate boilerplate code (e.g., implementing interfaces).
export const applyTypescriptFixes = vscode.commands.registerCommand('yutools.errors.applyTypescriptFixes', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const document = editor.document;
  const filePath = document.fileName;
  const text = document.getText();

  // Create a TypeScript SourceFile
  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);

  // Analyze the SourceFile for missing imports
  const missingImports = new Set();
  ts.forEachChild(sourceFile, node => {
    if (ts.isIdentifier(node) && node.text === 'fs') {
      missingImports.add('fs');
    }
  });

  // Add missing imports
  if (missingImports.size > 0) {
    const importStatement = `import { ${Array.from(missingImports).join(', ')} } from 'fs';\n`;
    const firstLine = document.lineAt(0).range;

    await editor.edit(editBuilder => {
      editBuilder.insert(firstLine.start, importStatement);
    });

    vscode.window.showInformationMessage('Added missing imports using TypeScript Compiler API.');
  } else {
    vscode.window.showInformationMessage('No missing imports found.');
  }
});
