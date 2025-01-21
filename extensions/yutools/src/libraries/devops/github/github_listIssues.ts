import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// List all issues and select multiple
export const github_listIssues = vscode.commands.registerCommand('yutools.github.listIssues', async () => {
  try {
    const output = await runCommand('gh issue list --json title,number');
    const issues = JSON.parse(output);

    const items = issues.map((issue: any) => ({
      label: `#${issue.number}: ${issue.title}`,
      issue,
    }));

    const selected = await vscode.window.showQuickPick(items as vscode.QuickPickItem[], {
      canPickMany: true,
      placeHolder: 'Select issues to open',
    }) as { label: string; issue: any }[] | undefined;

    if (selected && selected.length > 0) {
      const content = selected.map(s => `#${s.issue.number}: ${s.issue.title}`).join('\n');
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'plaintext',
      });
      await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to list issues: ${error}`);
  }
});