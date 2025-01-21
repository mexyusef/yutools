// Possible commands for "yutools.postgres" VSCode extension
// Note: Commands related to management of PostgreSQL are marked with (*) and implemented below.

import * as vscode from 'vscode';
import { Client } from 'pg'; // PostgreSQL client

// Connection management
let client: Client | null = null;
let isConnected = false;

async function getConnectionString(): Promise<string> {
    const connectionString = vscode.workspace.getConfiguration('yutools.databases.postgres').get<string>('connectionUri');
    if (!connectionString) {
        throw new Error('PostgreSQL connection URI is not configured in settings.');
    }
    return connectionString;
}

export async function connect(): Promise<void> {
    if (isConnected) {
        vscode.window.showInformationMessage('Already connected to PostgreSQL.');
        return;
    }

    const connectionString = await getConnectionString();
    client = new Client({ connectionString });
    try {
        await client.connect();
        isConnected = true;
        vscode.window.showInformationMessage('Connected to PostgreSQL.');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Connection failed: ${error.message}`);
    }
}

export async function disconnect(): Promise<void> {
    if (!isConnected || !client) {
        vscode.window.showInformationMessage('Not connected to PostgreSQL.');
        return;
    }

    try {
        await client.end();
        isConnected = false;
        vscode.window.showInformationMessage('Disconnected from PostgreSQL.');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Disconnection failed: ${error.message}`);
    }
}

// Database management
export async function listDatabases(): Promise<void> {
    if (!isConnected || !client) {
        vscode.window.showErrorMessage('Not connected to PostgreSQL.');
        return;
    }

    try {
        const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
        vscode.window.showQuickPick(res.rows.map(row => row.datname), {
            placeHolder: 'Select a database',
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to list databases: ${error.message}`);
    }
}

export async function createDatabase(): Promise<void> {
    const dbName = await vscode.window.showInputBox({ prompt: 'Enter the name of the new database' });
    if (!dbName || !client) return;

    try {
        await client.query(`CREATE DATABASE ${dbName}`);
        vscode.window.showInformationMessage(`Database '${dbName}' created successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create database: ${error.message}`);
    }
}

export async function dropDatabase(): Promise<void> {
    const dbName = await vscode.window.showInputBox({ prompt: 'Enter the name of the database to drop' });
    if (!dbName || !client) return;

    try {
        await client.query(`DROP DATABASE ${dbName}`);
        vscode.window.showInformationMessage(`Database '${dbName}' dropped successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to drop database: ${error.message}`);
    }
}

export async function executeSQLQuery(): Promise<void> {
    const sqlQuery = await vscode.window.showInputBox({ prompt: 'Enter your SQL query' });
    if (!sqlQuery || !client) return;

    try {
        const res = await client.query(sqlQuery);
        vscode.window.showInformationMessage(`Query executed successfully. Rows affected: ${res.rowCount}`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Query execution failed: ${error.message}`);
    }
}

/**
 * Activate the extension
 */
export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('yutools.postgres.connect', connect),
        vscode.commands.registerCommand('yutools.postgres.disconnect', disconnect),
        vscode.commands.registerCommand('yutools.postgres.listDatabases', listDatabases),
        vscode.commands.registerCommand('yutools.postgres.createDatabase', createDatabase),
        vscode.commands.registerCommand('yutools.postgres.dropDatabase', dropDatabase),
        vscode.commands.registerCommand('yutools.postgres.executeSQLQuery', executeSQLQuery)
    );
}

/**
 * Deactivate the extension
 */
export function deactivate(): void {
    if (isConnected && client) {
        client.end();
    }
}
