import { promises as fs } from 'fs';
import * as vscode from 'vscode';

interface Comment {
  type: 'single-line' | 'multi-line';
  text: string;
  line: number;
}

interface FileParseResult {
  comments: Comment[];
  contentWithoutComments: string;
}

// // Helper Functions
// const commentRegex: Record<'js' | 'py' | 'generic', RegExp[]> = {
//   js: [
//     /\/\/.*$/gm, // Single-line comments
//     /\/\*[\s\S]*?\*\//gm, // Multi-line comments
//   ],
//   py: [
//     /#.*$/gm, // Single-line comments
//   ],
//   generic: [
//     /\/\/.*$/gm,
//     /\/\*[\s\S]*?\*\//gm,
//     /#.*$/gm,
//   ],
// };

// function extractComments(content: string, language: 'js' | 'py' | 'generic'): Comment[] {
//   const regexes = commentRegex[language];
//   const comments: Comment[] = [];

//   regexes.forEach((regex) => {
//     let match;
//     while ((match = regex.exec(content)) !== null) {
//       const lines = content.substring(0, match.index).split('\n');
//       const line = lines.length;
//       comments.push({
//         type: regex === /\/\*[\s\S]*?\*\//gm ? 'multi-line' : 'single-line',
//         text: match[0],
//         line,
//       });
//     }
//   });

//   return comments;
// }
const commentRegex: Record<'js' | 'py' | 'generic', { regex: RegExp; type: 'single-line' | 'multi-line' }[]> = {
  js: [
    { regex: /\/\/.*$/gm, type: 'single-line' },
    { regex: /\/\*[\s\S]*?\*\//gm, type: 'multi-line' },
  ],
  py: [
    { regex: /#.*$/gm, type: 'single-line' },
  ],
  generic: [
    { regex: /\/\/.*$/gm, type: 'single-line' },
    { regex: /\/\*[\s\S]*?\*\//gm, type: 'multi-line' },
    { regex: /#.*$/gm, type: 'single-line' },
  ],
};

function extractComments(content: string, language: 'js' | 'py' | 'generic'): Comment[] {
  const regexes = commentRegex[language];
  const comments: Comment[] = [];

  regexes.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      comments.push({
        type,
        text: match[0],
        line,
      });
    }
  });

  return comments;
}

// function removeComments(content: string, language: 'js' | 'py' | 'generic'): string {
//   const regexes = commentRegex[language];
//   let result = content;

//   regexes.forEach(({ regex }) => {
//     result = result.replace(regex, ''); // Use the `regex` property
//   });

//   return result;
// }

function removeComments(content: string, language: 'js' | 'py' | 'generic'): string {
  if (language !== 'py') {
    // Fallback to regex-based removal for non-Python languages
    const regexes = commentRegex[language];
    let result = content;
    regexes.forEach(({ regex }) => {
      result = result.replace(regex, '');
    });
    return result;
  }

  // Python-specific comment removal logic
  const lines = content.split('\n');
  const result: string[] = [];
  const stringDelimiters = new Set(["'", '"']);
  let isInMultiLineString = false;
  let multiLineStringDelimiter = '';

  for (const line of lines) {
    let isInString: string | false = false; // Fix: Change type to string | false
    let newLine = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (isInMultiLineString) {
        newLine += char;
        if (char === multiLineStringDelimiter && line.slice(i, i + 3) === multiLineStringDelimiter.repeat(3)) {
          isInMultiLineString = false;
          i += 2; // Skip the next two characters
        }
      } else if (isInString) {
        newLine += char;
        if (char === isInString && (line[i - 1] !== '\\' || line.slice(i - 2, i) === '\\\\')) {
          isInString = false; // End of string
        }
      } else {
        if (stringDelimiters.has(char)) {
          if (line.slice(i, i + 3) === char.repeat(3)) {
            isInMultiLineString = true;
            multiLineStringDelimiter = char;
            newLine += char.repeat(3);
            i += 2; // Skip the next two characters
          } else {
            isInString = char; // Start of string
          }
        } else if (char === '#') {
          break; // Comment starts, ignore the rest of the line
        }
        newLine += char;
      }
    }
    result.push(newLine);
  }

  return result.join('\n');
}

function addComments(content: string, comments: Comment[], position: 'top' | 'bottom'): string {
  const formattedComments = comments.map((comment) => comment.text).join('\n');
  return position === 'top'
    ? `${formattedComments}\n${content}`
    : `${content}\n${formattedComments}`;
}

async function parseFile(filePath: string, language?: 'js' | 'py' | 'generic'): Promise<FileParseResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  const inferredLanguage = language || inferLanguage(filePath);
  const comments = extractComments(content, inferredLanguage);
  const contentWithoutComments = removeComments(content, inferredLanguage);
  return { comments, contentWithoutComments };
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

function inferLanguage(filePath: string): 'js' | 'py' | 'generic' {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts')) return 'js';
  if (filePath.endsWith('.py')) return 'py';
  return 'generic';
}

export async function listCommentsInActiveFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const content = editor.document.getText();
  const language = inferLanguage(editor.document.languageId);
  const comments = extractComments(content, language);

  const newDoc = await vscode.workspace.openTextDocument({
    language: 'plaintext',
    content: comments.map((c) => `Line ${c.line}: ${c.text}`).join('\n'),
  });

  vscode.window.showTextDocument(newDoc, { preview: false });
}

export async function removeAllCommentsInActiveFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const content = editor.document.getText();
  const language = inferLanguage(editor.document.languageId);
  const updatedContent = removeComments(content, language);

  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    editor.document.positionAt(0),
    editor.document.positionAt(content.length)
  );
  edit.replace(editor.document.uri, fullRange, updatedContent);
  await vscode.workspace.applyEdit(edit);
  await editor.document.save();
}

export async function stepThroughCommentsInActiveFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const content = editor.document.getText();
  const language = inferLanguage(editor.document.languageId);
  const comments = extractComments(content, language);

  let updatedContent = content;
  for (const comment of comments) {
    const shouldRemove = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Remove comment on line ${comment.line}? "${comment.text}"`,
    });

    if (shouldRemove === 'Yes') {
      updatedContent = updatedContent.replace(comment.text, '');
    }
  }

  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    editor.document.positionAt(0),
    editor.document.positionAt(content.length)
  );
  edit.replace(editor.document.uri, fullRange, updatedContent);
  await vscode.workspace.applyEdit(edit);
  await editor.document.save();
}

function removeCommentsWithLines(content: string, language: 'js' | 'py' | 'generic'): { contentWithoutComments: string, commentLines: Set<number> } {
  const regexes = commentRegex[language];
  let result = content;
  const commentLines = new Set<number>();

  regexes.forEach(({ regex }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const startLine = content.substring(0, match.index).split('\n').length - 1;
      const endLine = startLine + match[0].split('\n').length - 1;
      for (let i = startLine; i <= endLine; i++) {
        commentLines.add(i);
      }
    }
    result = result.replace(regex, '');
  });

  return { contentWithoutComments: result, commentLines };
}

export async function removeAllCommentsInActiveFileOmitLines() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const content = editor.document.getText();
  const language = inferLanguage(editor.document.languageId);
  const { contentWithoutComments, commentLines } = removeCommentsWithLines(content, language);

  // Remove lines that contained comments
  const lines = contentWithoutComments.split('\n');
  const filteredContent = lines.filter((_, index) => !commentLines.has(index)).join('\n');

  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    editor.document.positionAt(0),
    editor.document.positionAt(content.length)
  );
  edit.replace(editor.document.uri, fullRange, filteredContent);
  await vscode.workspace.applyEdit(edit);
  await editor.document.save();
}

export const CommentUtils = {
  extractComments,
  removeComments,
  addComments,
  parseFile,
  writeFile,
  listCommentsInActiveFile,
  removeAllCommentsInActiveFile,
  removeAllCommentsInActiveFileOmitLines,
  stepThroughCommentsInActiveFile,
};

// @TODO:
// now show me vscode commands that can utilize
// export const CommentUtils = {
//   extractComments,
//   removeComments,
//   addComments,
//   parseFile,
//   writeFile,
//   listCommentsInActiveFile,
//   removeAllCommentsInActiveFile,
//   stepThroughCommentsInActiveFile,
// };
