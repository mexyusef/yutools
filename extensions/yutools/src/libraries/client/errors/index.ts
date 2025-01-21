import { logger } from '@/yubantu/extension/logger';
import * as vscode from 'vscode';
import { register_errors_quickfix_commands } from './quick_fix';
import { applyTypescriptFixesWithTypeError } from './applyTypescriptFixesWithTypeError';

const ERROR_JOINER = '\n\n';

// Command to list all errors and warnings
const listDiagnostics2 = vscode.commands.registerCommand('yutools.errors.listErrorsAndWarnings2', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;

  if (document.languageId !== 'typescript' && document.languageId !== 'javascript') {
    vscode.window.showInformationMessage('This command only works with TypeScript or JavaScript files.');
    return;
  }

  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  if (diagnostics.length === 0) {
    vscode.window.showInformationMessage('No errors or warnings found.');
    return;
  }

  const messages = diagnostics.map((diag) => {
    const severity = vscode.DiagnosticSeverity[diag.severity];
    return `[${severity}] Line ${diag.range.start.line + 1}, Column ${diag.range.start.character + 1}: ${diag.message}`;
  });

  vscode.window.showQuickPick(messages, {
    canPickMany: false,
    title: 'Errors and Warnings',
    placeHolder: 'Select to focus on the issue',
  }).then((selectedMessage) => {
    if (!selectedMessage) return;

    const selectedDiagnostic = diagnostics[messages.indexOf(selectedMessage)];
    editor.selection = new vscode.Selection(selectedDiagnostic.range.start, selectedDiagnostic.range.end);
    editor.revealRange(selectedDiagnostic.range, vscode.TextEditorRevealType.InCenter);
  });
});

const listDiagnostics = vscode.commands.registerCommand('yutools.errors.listErrorsAndWarnings', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }
  const document = editor.document;
  logger.log(`list errors/warnings utk dokumen ${JSON.stringify(document)}`);
  // Fetch all workspace diagnostics
  const allDiagnostics = vscode.languages.getDiagnostics();
  const currentDiagnostics = allDiagnostics.filter(([uri]) => uri.toString() === document.uri.toString());
  const diagnostics = currentDiagnostics.flatMap(([, diags]) => diags);

  console.log('Diagnostics:', diagnostics);

  if (diagnostics.length === 0) {
    vscode.window.showInformationMessage('No errors or warnings found.');
    return;
  }

  const severityMap = {
    [vscode.DiagnosticSeverity.Error]: 'Error',
    [vscode.DiagnosticSeverity.Warning]: 'Warning',
    [vscode.DiagnosticSeverity.Information]: 'Information',
    [vscode.DiagnosticSeverity.Hint]: 'Hint',
  };
  const messages = diagnostics.map((diag) => {
    const severity = severityMap[diag.severity];
    return `[${severity}] Line ${diag.range.start.line + 1}, Column ${diag.range.start.character + 1}: ${diag.message}`;
  });
  logger.log(`list errors/warnings messages = ${JSON.stringify(messages)}`);
  const selectedMessage = await vscode.window.showQuickPick(messages, {
    canPickMany: false,
    title: 'Errors and Warnings',
    placeHolder: 'Select to focus on the issue',
  });

  if (selectedMessage) {
    const selectedDiagnostic = diagnostics[messages.indexOf(selectedMessage)];
    editor.selection = new vscode.Selection(selectedDiagnostic.range.start, selectedDiagnostic.range.end);
    editor.revealRange(selectedDiagnostic.range, vscode.TextEditorRevealType.InCenter);
  }
});

const joinErrors = vscode.commands.registerCommand('yutools.errors.joinErrors', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const errors = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag) => `Line ${diag.range.start.line + 1}, Column ${diag.range.start.character + 1}: ${diag.message}`)
    .join(ERROR_JOINER);

  if (!errors) {
    vscode.window.showInformationMessage('No errors found.');
    return;
  }

  const newFile = await vscode.workspace.openTextDocument({ content: errors, language: 'plaintext' });
  await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });
});

// Command to join all warnings and show in a new file
const joinWarnings = vscode.commands.registerCommand('yutools.errors.joinWarnings', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const warnings = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Warning)
    .map((diag) => `Line ${diag.range.start.line + 1}, Column ${diag.range.start.character + 1}: ${diag.message}`)
    .join(ERROR_JOINER);

  if (!warnings) {
    vscode.window.showInformationMessage('No warnings found.');
    return;
  }

  const newFile = await vscode.workspace.openTextDocument({ content: warnings, language: 'plaintext' });
  await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });
});

const toggleProblems = vscode.commands.registerCommand('yutools.errors.toggleProblems', async () => {
  await vscode.commands.executeCommand('workbench.action.problems.focus');
  // await vscode.commands.executeCommand('editor.action.diagnostic.refresh');
});

const filterDiagnostics = vscode.commands.registerCommand('yutools.errors.filterDiagnostics', async () => {
  const allDiagnostics = vscode.languages.getDiagnostics();

  // Filter diagnostics by type
  const errors = allDiagnostics.flatMap(([uri, diags]) =>
    diags.filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error).map((diag) => ({ uri, diag }))
  );

  const warnings = allDiagnostics.flatMap(([uri, diags]) =>
    diags.filter((diag) => diag.severity === vscode.DiagnosticSeverity.Warning).map((diag) => ({ uri, diag }))
  );

  const options = [
    { label: 'Show All Diagnostics', diagnostics: allDiagnostics.flatMap(([uri, diags]) => 
        diags.map((diag) => ({ uri, diag }))) },
    { label: 'Show Only Errors', diagnostics: errors },
    { label: 'Show Only Warnings', diagnostics: warnings },
  ];

  const selectedOption = await vscode.window.showQuickPick(
    options.map((opt) => opt.label),
    { title: 'Filter Diagnostics', placeHolder: 'Choose a diagnostics filter' }
  );

  if (!selectedOption) return;

  const selectedDiagnostics = options.find((opt) => opt.label === selectedOption)?.diagnostics ?? [];

  // Display filtered diagnostics
  const content = selectedDiagnostics
    .map(({ uri, diag }) =>
      `[${diag.severity === vscode.DiagnosticSeverity.Error ? 'Error' : 'Warning'}] (${uri.fsPath}) Line ${
        diag.range.start.line + 1
      }: ${diag.message}`
    )
    .join(ERROR_JOINER);

  const doc = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
  await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
});

const joinErrorsWithCodeLLMFormat = vscode.commands.registerCommand('yutools.errors.joinErrorsWithCodeLLMFormat', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const errors = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag, index) => {
      const errorNumber = index + 1;
      const line = diag.range.start.line;
      const column = diag.range.start.character + 1;
      const codeLine = document.lineAt(line).text.trim();
      const message = diag.message;

      // return `Error:\n  Line: ${line + 1}, Column: ${column}\n  Message: ${message}\n\nCode Context:\n  ${codeLine}`;
      return `Error ${errorNumber}:\n  Line: ${line + 1}, Column: ${column}\n  Message: ${message}\n\nCode Context:\n  ${codeLine}`;
    })
    .join(`\n\n---\n\n`);

  if (!errors) {
    vscode.window.showInformationMessage('No errors found.');
    return;
  }

  const newFile = await vscode.workspace.openTextDocument({ content: errors, language: 'plaintext' });
  await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });
});

const joinErrorsWithNumberingAndFileContent = vscode.commands.registerCommand('yutools.errors.joinErrorsWithNumberingAndFileContent', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const errors = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag, index) => {
      const errorNumber = index + 1;
      const line = diag.range.start.line;
      const column = diag.range.start.character + 1;
      const codeLine = document.lineAt(line).text.trim();
      const message = diag.message;

      return `Error ${errorNumber}:\n  Line: ${line + 1}, Column: ${column}\n  Message: ${message}\n\nCode Context:\n  ${codeLine}`;
    })
    .join(`\n\n---\n\n`);

  const fileContent = document.getText();
  const result = errors
    ? `${errors}\n\n---\n\n### Entire File Content\n\n${fileContent}`
    : `No errors found.\n\n---\n\n### Entire File Content\n\n${fileContent}`;

  const newFile = await vscode.workspace.openTextDocument({ content: result, language: 'plaintext' });
  await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });
});

const joinErrorsWithEnhancedFormat = vscode.commands.registerCommand('yutools.errors.joinErrorsWithEnhancedFormat', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const errors = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag, index) => {
      const errorNumber = index + 1;
      const line = diag.range.start.line;
      const column = diag.range.start.character + 1;
      const message = diag.message;

      // Get the error line and its surrounding context
      const errorLine = document.lineAt(line).text.trim();
      const prevLine = line > 0 ? document.lineAt(line - 1).text.trim() : '';
      const nextLine = line < document.lineCount - 1 ? document.lineAt(line + 1).text.trim() : '';

      // Format the error with expanded context
      return `Error ${errorNumber}:
  Location: Line ${line + 1}, Column ${column}
  Message: ${message}

Code Context:
  ${prevLine}
  ${errorLine}  <-- Error here
  ${nextLine}`;
    })
    .join(`\n\n---\n\n`);

  if (!errors) {
    vscode.window.showInformationMessage('No errors found.');
    return;
  }

  // Create a new file with the formatted errors
  const newFile = await vscode.workspace.openTextDocument({ content: errors, language: 'plaintext' });
  const newEditor = await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });

  // Add interactive navigation
  const errorLocations = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag) => diag.range.start);

  // Listen for text selection changes in the new file
  const disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
    if (event.textEditor === newEditor) {
      const cursorPosition = event.selections[0].active;
      const errorIndex = cursorPosition.line;

      if (errorLocations[errorIndex]) {
        // Navigate to the error location in the original file
        const errorLocation = new vscode.Range(
          errorLocations[errorIndex].line,
          errorLocations[errorIndex].character,
          errorLocations[errorIndex].line,
          errorLocations[errorIndex].character
        );

        vscode.window.showTextDocument(document.uri, { selection: errorLocation });
      }
    }
  });

  // Clean up the disposable when the new editor is closed
  const closeDisposable = vscode.workspace.onDidCloseTextDocument((closedDocument) => {
    if (closedDocument === newFile) {
      disposable.dispose();
      closeDisposable.dispose();
    }
  });
});

const joinErrorsWithNumberingAndFileContentEnhanced = vscode.commands.registerCommand('yutools.errors.joinErrorsWithNumberingAndFileContentEnhanced', async () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const errors = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag, index) => {
      const errorNumber = index + 1;
      const line = diag.range.start.line;
      const column = diag.range.start.character + 1;
      const message = diag.message;

      // Get the error line and its surrounding context
      const errorLine = document.lineAt(line).text.trim();
      const prevLine = line > 0 ? document.lineAt(line - 1).text.trim() : '';
      const nextLine = line < document.lineCount - 1 ? document.lineAt(line + 1).text.trim() : '';

      // Format the error with expanded context
      return `Error ${errorNumber}:
  Location: Line ${line + 1}, Column ${column}
  Message: ${message}

Code Context:
  ${prevLine}
  ${errorLine}  <-- Error here
  ${nextLine}`;
    })
    .join(`\n\n---\n\n`);

  const fileContent = document.getText();
  const result = errors
    ? `${errors}\n\n---\n\n### Entire File Content\n\n${fileContent}`
    : `No errors found.\n\n---\n\n### Entire File Content\n\n${fileContent}`;

  // Create a new file with the formatted errors and file content
  const newFile = await vscode.workspace.openTextDocument({ content: result, language: 'plaintext' });
  const newEditor = await vscode.window.showTextDocument(newFile, { viewColumn: vscode.ViewColumn.Beside });

  // Add interactive navigation
  const errorLocations = diagnostics
    .filter((diag) => diag.severity === vscode.DiagnosticSeverity.Error)
    .map((diag) => diag.range.start);

  // Listen for text selection changes in the new file
  const disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
    if (event.textEditor === newEditor) {
      const cursorPosition = event.selections[0].active;
      const errorIndex = cursorPosition.line;

      if (errorLocations[errorIndex]) {
        // Navigate to the error location in the original file
        const errorLocation = new vscode.Range(
          errorLocations[errorIndex].line,
          errorLocations[errorIndex].character,
          errorLocations[errorIndex].line,
          errorLocations[errorIndex].character
        );

        vscode.window.showTextDocument(document.uri, { selection: errorLocation });
      }
    }
  });

  // Clean up the disposable when the new editor is closed
  const closeDisposable = vscode.workspace.onDidCloseTextDocument((closedDocument) => {
    if (closedDocument === newFile) {
      disposable.dispose();
      closeDisposable.dispose();
    }
  });
});

export function register_errors_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    listDiagnostics,
    joinErrors,
    joinWarnings,
    filterDiagnostics,
    toggleProblems,
  );
  context.subscriptions.push(joinErrorsWithCodeLLMFormat);
  context.subscriptions.push(joinErrorsWithNumberingAndFileContent);
  context.subscriptions.push(joinErrorsWithEnhancedFormat);
  context.subscriptions.push(joinErrorsWithNumberingAndFileContentEnhanced);
  context.subscriptions.push(applyTypescriptFixesWithTypeError);
  register_errors_quickfix_commands(context);
}
