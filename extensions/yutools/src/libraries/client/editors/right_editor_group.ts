import * as vscode from 'vscode';

export function register_toggle_right_group_commands(context: vscode.ExtensionContext) {
  let rightEditorGroupHidden = false;
  let previousRightEditorWidth: number | undefined;
  let previousEditors: vscode.TextEditor[] = [];
  let isMaximized = false;
  let isGroup2Hidden = false;
  let group2Editors: vscode.TextEditor[] = [];

  let disposable = vscode.commands.registerCommand('yutools.editors.toggleRightEditorGroup', async () => {

    if (isGroup2Hidden) {
      // Restore Group 2 editors
      for (const editor of group2Editors) {
        await vscode.window.showTextDocument(editor.document, { viewColumn: vscode.ViewColumn.Beside });
      }
      isGroup2Hidden = false;
      vscode.window.showInformationMessage('Group 2 editors restored.');
    } else {
      // Hide Group 2 editors
      const editors = vscode.window.visibleTextEditors;
      group2Editors = editors.filter(editor => {
        const group = vscode.window.tabGroups.all.find(group =>
          group.tabs.some(tab => tab.input instanceof vscode.TabInputText && tab.input.uri === editor.document.uri)
        );
        return group?.viewColumn === vscode.ViewColumn.Beside;
      });

      // Move all Group 2 editors to Group 1
      for (const editor of group2Editors) {
        await vscode.window.showTextDocument(editor.document, { viewColumn: vscode.ViewColumn.Active });
      }

      isGroup2Hidden = true;
      vscode.window.showInformationMessage('Group 2 editors hidden.');
    }


  });

  context.subscriptions.push(disposable);
}
