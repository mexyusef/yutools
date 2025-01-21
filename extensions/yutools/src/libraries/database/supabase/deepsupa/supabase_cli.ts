import * as vscode from 'vscode';
import { exec } from 'child_process';

const initSupabaseProject = vscode.commands.registerCommand('yutools.supabase.initProject', async () => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Initializing Supabase project...',
		},
		async () => {
			exec('npx supabase init', { cwd: workspaceFolder }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error initializing Supabase project: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage('Supabase project initialized successfully.');
			});
		}
	);
});

const startSupabaseServices = vscode.commands.registerCommand('yutools.supabase.startServices', async () => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Starting Supabase services...',
		},
		async () => {
			exec('npx supabase start', { cwd: workspaceFolder }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error starting Supabase services: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage('Supabase services started successfully.');
				console.log(stdout); // Log the output for debugging
			});
		}
	);
});

const stopSupabaseServices = vscode.commands.registerCommand('yutools.supabase.stopServices', async () => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Stopping Supabase services...',
		},
		async () => {
			exec('npx supabase stop', { cwd: workspaceFolder }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error stopping Supabase services: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage('Supabase services stopped successfully.');
			});
		}
	);
});

const backupLocalDatabase = vscode.commands.registerCommand('yutools.supabase.backupLocalDatabase', async () => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Backing up local database...',
		},
		async () => {
			exec('npx supabase db dump --local', { cwd: workspaceFolder }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error backing up local database: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage('Local database backed up successfully.');
			});
		}
	);
});

const applyMigrations = vscode.commands.registerCommand('yutools.supabase.applyMigrations', async () => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Applying database migrations...',
		},
		async () => {
			exec('npx supabase db reset', { cwd: workspaceFolder }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error applying migrations: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage('Database migrations applied successfully.');
			});
		}
	);
});

// Step 6: Add Documentation
// Provide clear instructions for users on how to use the Supabase CLI commands in your extension.
// You can include this in your extension’s README or a dedicated documentation file.
// Links to Resources
// Supabase CLI Documentation: https://supabase.com/docs/guides/local-development/cli
// Supabase CLI Reference: https://supabase.com/docs/reference/cli
// Node.js child_process Documentation: https://nodejs.org/api/child_process.html

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		initSupabaseProject,
		startSupabaseServices,
		stopSupabaseServices,
		backupLocalDatabase,
		applyMigrations,
	);
}
