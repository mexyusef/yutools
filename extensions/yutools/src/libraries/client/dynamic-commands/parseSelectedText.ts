import * as vscode from 'vscode';

// utk select javascript object
export function parseSelectedText(selectedText: string): any {
  try {
    // Use `eval` to parse the selected text as a JavaScript object
    // WARNING: `eval` can be dangerous if the input is not trusted
    const parsedObject = eval(`(${selectedText})`);
    return parsedObject;
  } catch (err) {
    vscode.window.showErrorMessage('Failed to parse selected text as a JavaScript object.');
    return null;
  }
}

// In this case, the selected text must be valid JSON (e.g., double quotes for keys and strings):
// {
//   "terminalName": "Dynamic Terminal Super Keren",
//   "cwd": "c:\\hapus",
//   "commands": [
//     "echo Dynamic Command",
//     "pwd",
//     "dir"
//   ]
// }
export function parseSelectedTextForValidJSON(selectedText: string): any {
  try {
    // Parse the selected text as JSON
    const parsedObject = JSON.parse(selectedText);
    return parsedObject;
  } catch (err) {
    vscode.window.showErrorMessage('Selected text is not valid JSON.');
    return null;
  }
}