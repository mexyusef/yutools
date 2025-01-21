import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function register_github_actions_commands(context: vscode.ExtensionContext): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('No workspace folder is open. Please open a workspace to use GitHub Actions features.');
    return;
  }

  const workflowsPath = path.join(workspaceRoot, '.github', 'workflows');

  // Helper function to ensure .github/workflows exists
  function ensureWorkflowsFolder(): void {
    if (!fs.existsSync(workflowsPath)) {
      fs.mkdirSync(workflowsPath, { recursive: true });
    }
  }

  // Command 1: Initialize GitHub Actions Workflow
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.initializeWorkflow', async () => {
      try {
        ensureWorkflowsFolder();

        const defaultContent = `name: CI Workflow

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
`;

        const fileName = await vscode.window.showInputBox({ prompt: 'Enter workflow file name (e.g., ci.yml)' });
        if (fileName) {
          const filePath = path.join(workflowsPath, fileName);
          fs.writeFileSync(filePath, defaultContent);
          vscode.window.showInformationMessage(`Workflow file ${fileName} created successfully.`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to initialize workflow: ${(error as Error).message}`);
      }
    })
  );

  // Command 2: List GitHub Actions Workflows
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.listWorkflows', () => {
      try {
        if (fs.existsSync(workflowsPath)) {
          const workflows = fs.readdirSync(workflowsPath).filter(file => file.endsWith('.yml'));
          vscode.window.showQuickPick(workflows, { title: 'Select a workflow to open' }).then(selected => {
            if (selected) {
              const filePath = path.join(workflowsPath, selected);
              vscode.workspace.openTextDocument(filePath).then(doc => vscode.window.showTextDocument(doc));
            }
          });
        } else {
          vscode.window.showWarningMessage('No workflows found in the repository.');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to list workflows: ${(error as Error).message}`);
      }
    })
  );

  // Command 3: Enable/Disable Workflow (Placeholder for API Integration)
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.toggleWorkflow', async () => {
      try {
        vscode.window.showInformationMessage('Enable/Disable Workflow is a placeholder for GitHub API integration.');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to toggle workflow: ${(error as Error).message}`);
      }
    })
  );

  // Command 9: Edit Workflow File
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.editWorkflow', async () => {
      try {
        if (fs.existsSync(workflowsPath)) {
          const workflows = fs.readdirSync(workflowsPath).filter(file => file.endsWith('.yml'));
          vscode.window.showQuickPick(workflows, { title: 'Select a workflow to edit' }).then(selected => {
            if (selected) {
              const filePath = path.join(workflowsPath, selected);
              vscode.workspace.openTextDocument(filePath).then(doc => vscode.window.showTextDocument(doc));
            }
          });
        } else {
          vscode.window.showWarningMessage('No workflows found to edit.');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to edit workflow: ${(error as Error).message}`);
      }
    })
  );

  // Command 10: Delete Workflow File
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.deleteWorkflow', async () => {
      try {
        if (fs.existsSync(workflowsPath)) {
          const workflows = fs.readdirSync(workflowsPath).filter(file => file.endsWith('.yml'));
          vscode.window.showQuickPick(workflows, { title: 'Select a workflow to delete' }).then(selected => {
            if (selected) {
              const filePath = path.join(workflowsPath, selected);
              fs.unlinkSync(filePath);
              vscode.window.showInformationMessage(`Workflow ${selected} deleted successfully.`);
            }
          });
        } else {
          vscode.window.showWarningMessage('No workflows found to delete.');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to delete workflow: ${(error as Error).message}`);
      }
    })
  );

  // Command 12: Validate Workflow (Placeholder for Syntax Validation)
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.validateWorkflow', () => {
      try {
        vscode.window.showInformationMessage('Validate Workflow is a placeholder for YAML linting integration.');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to validate workflow: ${(error as Error).message}`);
      }
    })
  );

  // Command 13: Deploy to GitHub Pages
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.ghactions.deployToPages', async () => {
      try {
        ensureWorkflowsFolder();

        const deployContent = `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies and build
        run: |
          npm install
          npm run build
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
`;

        const filePath = path.join(workflowsPath, 'deploy-pages.yml');
        fs.writeFileSync(filePath, deployContent);
        vscode.window.showInformationMessage('GitHub Pages deployment workflow created successfully.');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create GitHub Pages workflow: ${(error as Error).message}`);
      }
    })
  );
}

// function deactivate(): void {}
// export { activate, deactivate };
