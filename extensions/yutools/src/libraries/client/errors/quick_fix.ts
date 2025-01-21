import * as vscode from 'vscode';

let fixUndefinedSymbol = vscode.commands.registerCommand('yutools.errors.fixUndefinedSymbol', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const document = editor.document;
  const position = editor.selection.active;

  // Get diagnostics (errors) at the cursor position
  const diagnostics = vscode.languages.getDiagnostics(document.uri).filter(diagnostic => {
    return diagnostic.range.contains(position) && diagnostic.severity === vscode.DiagnosticSeverity.Error;
  });

  if (diagnostics.length === 0) {
    vscode.window.showInformationMessage('No errors found at the cursor position.');
    return;
  }

  // Trigger the Quick Fix menu
  await vscode.commands.executeCommand('editor.action.quickFix');

  // Wait for the Quick Fix menu to appear
  setTimeout(async () => {
    // Simulate selecting the first Quick Fix option (you may need to refine this)
    await vscode.commands.executeCommand('selectFirstSuggestion');
  }, 500); // Adjust the delay if necessary
});

let applyAllQuickFixes = vscode.commands.registerCommand('yutools.errors.applyAllQuickFixes', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }
  // Trigger the "autoFix" command for the entire document
  await vscode.commands.executeCommand('editor.action.autoFix', editor.document.uri);
  // vscode.window.showInformationMessage('Applied all Quick Fixes.');
});

export function register_errors_quickfix_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(applyAllQuickFixes);
  context.subscriptions.push(fixUndefinedSymbol);
}

