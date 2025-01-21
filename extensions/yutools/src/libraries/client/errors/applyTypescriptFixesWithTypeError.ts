import vscode from 'vscode';
import ts from 'typescript';

export const applyTypescriptFixesWithTypeError = vscode.commands.registerCommand('yutools.errors.applyTypescriptFixesWithTypeError', async () => {
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

  // Track changes to the document
  const changes: { range: vscode.Range; text: string }[] = [];

  // Analyze the SourceFile for issues
  analyzeSourceFile(sourceFile, changes);

  // Apply changes to the document
  if (changes.length > 0) {
    await editor.edit(editBuilder => {
      for (const change of changes) {
        editBuilder.replace(change.range, change.text);
      }
    });

    vscode.window.showInformationMessage('Applied TypeScript fixes.');
  } else {
    vscode.window.showInformationMessage('No TypeScript fixes available.');
  }
});


/**
 * Analyzes the TypeScript SourceFile and collects fixes.
 */
function analyzeSourceFile(sourceFile: ts.SourceFile, changes: { range: vscode.Range; text: string }[]) {
  const checker = ts.createProgram([sourceFile.fileName], {}).getTypeChecker();

  // Analyze nodes in the SourceFile
  ts.forEachChild(sourceFile, node => {
    // 1. Add missing imports
    if (ts.isIdentifier(node) && node.text === 'fs') {
      const importStatement = `import { ${node.text} } from 'fs';\n`;
      const range = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(0, 0)
      );
      changes.push({ range, text: importStatement });
    }

    // 2. Remove unused imports
    if (ts.isImportDeclaration(node)) {
      const symbol = checker.getSymbolAtLocation(node.moduleSpecifier);
      if (symbol && !isImportUsed(node, sourceFile, checker)) {
        const range = new vscode.Range(
          new vscode.Position(node.getStart(), 0),
          new vscode.Position(node.getEnd(), 0)
        );
        changes.push({ range, text: '' });
      }
    }

    // 3. Fix type errors (e.g., add missing properties)
    if (ts.isObjectLiteralExpression(node)) {
      const type = checker.getTypeAtLocation(node);
      const missingProperties = type.getProperties().filter(property => {
        return !node.properties.some(p => p.name?.getText() === property.name);
      });

      if (missingProperties.length > 0) {
        // const newProperties = missingProperties.map(property => `${property.name}: ${getDefaultValue(property)}`).join(',\n');
        const newProperties = missingProperties.map(property => `${property.name}: ${getDefaultValue(property, checker)}`).join(',\n');
        const range = new vscode.Range(
          new vscode.Position(node.getEnd(), 0),
          new vscode.Position(node.getEnd(), 0)
        );
        changes.push({ range, text: `,\n${newProperties}` });
      }
    }
  });
}

/**
 * Checks if an import is used in the SourceFile.
 */
function isImportUsed(importNode: ts.ImportDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): boolean {
  const importSymbol = checker.getSymbolAtLocation(importNode.moduleSpecifier);
  if (!importSymbol) return false;

  let isUsed = false;
  ts.forEachChild(sourceFile, node => {
    if (ts.isIdentifier(node) && checker.getSymbolAtLocation(node) === importSymbol) {
      isUsed = true;
    }
  });
  return isUsed;
}

/**
 * Returns a default value for a property based on its type.
 */
function getDefaultValue(property: ts.Symbol, checker: ts.TypeChecker): string {
  const type = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
  if (type) {
    if (type.flags & ts.TypeFlags.String) return "''";
    if (type.flags & ts.TypeFlags.Number) return '0';
    if (type.flags & ts.TypeFlags.Boolean) return 'false';
  }
  return 'undefined';
}