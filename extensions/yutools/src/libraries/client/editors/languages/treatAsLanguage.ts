import * as vscode from 'vscode';

export const treatAsLanguage = vscode.commands.registerCommand('yutools.editors.language.treatAsLanguage', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const languageOptions = [
    'TypeScript',
    'Python',
    'Markdown',
    'Plain Text',
    'FMUS',
  ];
  const selectedLanguage = await vscode.window.showQuickPick(languageOptions, {
    placeHolder: 'Select a language to treat the file as',
  });

  if (selectedLanguage) {
    const languageId = selectedLanguage.toLowerCase().replace(' ', '');
    const document = editor.document;

    // Set the language mode for the document
    await vscode.languages.setTextDocumentLanguage(document, languageId);

    vscode.window.showInformationMessage(`Treating file as ${selectedLanguage}.`);
  }
});