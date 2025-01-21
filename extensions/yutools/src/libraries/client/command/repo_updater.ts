import * as vscode from 'vscode';

const repos: { [key: string]: string } = {
  "aider": "C:\\ai\\yuagent\\extensions\\yu-servers\\aider",
  "bolt.diy": "C:\\ai\\yuagent\\extensions\\yu-servers\\bolt.diy",
  "cline": "C:\\ai\\yuagent\\extensions\\yu-servers\\cline",
  "llamacoder": "C:\\ai\\yuagent\\extensions\\yu-servers\\llamacoder",
  "sidecar": "C:\\ai\\yuagent\\extensions\\yu-servers\\sidecar",
  "srcbook": "C:\\ai\\yuagent\\extensions\\yu-servers\\srcbook",
};

const gitOperations = vscode.commands.registerCommand("yutools.picker.gitOperations", async () => {
  const selectedRepo = await vscode.window.showQuickPick(Object.keys(repos), {
    placeHolder: "Select a repository to fetch, diff, and optionally pull",
  });

  if (selectedRepo) {
    const repoPath = repos[selectedRepo];
    const terminal = vscode.window.createTerminal({
      name: `Git: ${selectedRepo}`,
      shellPath: vscode.env.shell,
    });
    terminal.show();

    // Run Git commands
    terminal.sendText(`cd "${repoPath}"`);
    terminal.sendText("git fetch");
    terminal.sendText("git diff");

    // Prompt user input for pull
    vscode.window
      .showInformationMessage(
        `Do you want to pull updates for ${selectedRepo}?`,
        "Yes",
        "No"
      )
      .then((answer) => {
        if (answer === "Yes") {
          terminal.sendText("git pull");
        }
      });
  }
});

/**
 * Registers commands and integrates terminal shell interaction
 */
export function register_repo_updater_commands(context: vscode.ExtensionContext) {
  // Push the command to context
  context.subscriptions.push(gitOperations);
}
