import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as fs from 'fs';

// Types for environment and configuration
interface Environment {
    endpoint: string;
}

interface SavedRequest {
    name: string;
    query: string;
}

export function activate(context: vscode.ExtensionContext): void {
    // Command 6: Set GraphQL Endpoint
    const setEndpointCommand = vscode.commands.registerCommand('yutools.graphql.setEndpoint', async () => {
        const endpoint = await vscode.window.showInputBox({
            prompt: 'Enter the GraphQL endpoint URL',
        });

        if (endpoint) {
            vscode.workspace.getConfiguration('yutools.graphql').update('endpoint', endpoint, true);
            vscode.window.showInformationMessage(`GraphQL endpoint set to ${endpoint}`);
        } else {
            vscode.window.showWarningMessage('GraphQL endpoint not set.');
        }
    });

    // Command 7: Manage Environment Variables
    const manageEnvCommand = vscode.commands.registerCommand('yutools.graphql.manageEnvs', async () => {
        const envs: Record<string, Environment> = vscode.workspace.getConfiguration('yutools.graphql').get('environments') || {};
        const action = await vscode.window.showQuickPick(['Add Environment', 'Edit Environment', 'Switch Environment'], { placeHolder: 'Select an action' });

        if (action === 'Add Environment') {
            const name = await vscode.window.showInputBox({ prompt: 'Enter environment name' });
            const endpoint = await vscode.window.showInputBox({ prompt: 'Enter endpoint URL for this environment' });
            if (name && endpoint) {
                envs[name] = { endpoint };
                vscode.workspace.getConfiguration('yutools.graphql').update('environments', envs, true);
                vscode.window.showInformationMessage(`Environment ${name} added.`);
            }
        } else if (action === 'Edit Environment') {
            const envName = await vscode.window.showQuickPick(Object.keys(envs), { placeHolder: 'Select an environment to edit' });
            if (envName) {
                const newEndpoint = await vscode.window.showInputBox({ prompt: 'Enter new endpoint URL', value: envs[envName].endpoint });
                if (newEndpoint) {
                    envs[envName].endpoint = newEndpoint;
                    vscode.workspace.getConfiguration('yutools.graphql').update('environments', envs, true);
                    vscode.window.showInformationMessage(`Environment ${envName} updated.`);
                }
            }
        } else if (action === 'Switch Environment') {
            const selectedEnv = await vscode.window.showQuickPick(Object.keys(envs), { placeHolder: 'Select an environment to switch to' });
            if (selectedEnv) {
                vscode.workspace.getConfiguration('yutools.graphql').update('currentEnvironment', selectedEnv, true);
                vscode.window.showInformationMessage(`Switched to environment ${selectedEnv}.`);
            }
        }
    });

    // Command 8: Inspect Schema
    const inspectSchemaCommand = vscode.commands.registerCommand('yutools.graphql.inspectSchema', async () => {
        const endpoint = vscode.workspace.getConfiguration('yutools.graphql').get<string>('endpoint');
        if (!endpoint) {
            vscode.window.showErrorMessage('No GraphQL endpoint set. Use the "Set GraphQL Endpoint" command first.');
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: '{ __schema { types { name } } }' })
            });

            const data = await response.json();
            if (data.errors) {
                vscode.window.showErrorMessage(`Error fetching schema: ${data.errors[0].message}`);
            } else {
                vscode.window.showInformationMessage('Schema fetched successfully. See output panel.');
                const outputChannel = vscode.window.createOutputChannel('GraphQL Schema');
                outputChannel.appendLine(JSON.stringify(data.data, null, 2));
                outputChannel.show();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch schema: ${(error as Error).message}`);
        }
    });

    // Command 13: Export/Import Requests
    const exportImportCommand = vscode.commands.registerCommand('yutools.graphql.exportImport', async () => {
        const action = await vscode.window.showQuickPick(['Export Requests', 'Import Requests'], { placeHolder: 'Select an action' });

        if (action === 'Export Requests') {
            const savedRequests: SavedRequest[] = vscode.workspace.getConfiguration('yutools.graphql').get('savedRequests') || [];
            const filePath = await vscode.window.showSaveDialog({ filters: { JSON: ['json'] } });
            if (filePath) {
                fs.writeFileSync(filePath.fsPath, JSON.stringify(savedRequests, null, 2));
                vscode.window.showInformationMessage('Requests exported successfully.');
            }
        } else if (action === 'Import Requests') {
            const fileUri = await vscode.window.showOpenDialog({ filters: { JSON: ['json'] } });
            if (fileUri && fileUri.length) {
                const content = fs.readFileSync(fileUri[0].fsPath, 'utf8');
                const importedRequests = JSON.parse(content) as SavedRequest[];
                vscode.workspace.getConfiguration('yutools.graphql').update('savedRequests', importedRequests, true);
                vscode.window.showInformationMessage('Requests imported successfully.');
            }
        }
    });

    // Command 3: Send GraphQL Request
    const sendRequestCommand = vscode.commands.registerCommand('yutools.graphql.sendRequest', async () => {
        const endpoint = vscode.workspace.getConfiguration('yutools.graphql').get<string>('endpoint');
        if (!endpoint) {
            vscode.window.showErrorMessage('No GraphQL endpoint set. Use the "Set GraphQL Endpoint" command first.');
            return;
        }

        const query = await vscode.window.showInputBox({ prompt: 'Enter your GraphQL query' });
        if (!query) {
            vscode.window.showWarningMessage('No query entered.');
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            const outputChannel = vscode.window.createOutputChannel('GraphQL Response');
            outputChannel.appendLine(JSON.stringify(data, null, 2));
            outputChannel.show();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to send request: ${(error as Error).message}`);
        }
    });

    // Register all commands
    context.subscriptions.push(setEndpointCommand, manageEnvCommand, inspectSchemaCommand, exportImportCommand, sendRequestCommand);
}

export function deactivate(): void {}
