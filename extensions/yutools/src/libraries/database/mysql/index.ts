// yutools.mysql - VSCode Extension MySQL Commands

import * as vscode from 'vscode';
import { Connection, createConnection } from 'mysql2/promise';

let connection: Connection | null = null;

// Utility: Fetch connection URI from settings
async function getConnectionURI(): Promise<string> {
    const uri = vscode.workspace.getConfiguration('yutools.databases').get<string>('mysql');
    if (!uri) {
        throw new Error('Connection URI not found in yutools.databases.mysql setting.');
    }
    return uri;
}

// 1. Connect to MySQL Database
export async function connectToDatabase(): Promise<void> {
    try {
        const uri = await getConnectionURI();
        connection = await createConnection(uri);
        vscode.window.showInformationMessage('Connected to MySQL database successfully.');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to connect: ${(error as Error).message}`);
    }
}

// 2. Show Databases
export async function showDatabases(): Promise<void> {
    try {
        if (!connection) throw new Error('No active database connection.');
        const [databases] = await connection.query('SHOW DATABASES');
        const databaseNames = (databases as { Database: string }[]).map(db => db.Database);
        await vscode.window.showQuickPick(databaseNames, {
            placeHolder: 'Select a database',
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error showing databases: ${(error as Error).message}`);
    }
}

// 3. Create Database
export async function createDatabase(): Promise<void> {
    try {
        const dbName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the new database',
        });
        if (!dbName) return;
        if (!connection) throw new Error('No active database connection.');
        await connection.query(`CREATE DATABASE \`${dbName}\``);
        vscode.window.showInformationMessage(`Database '${dbName}' created successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error creating database: ${(error as Error).message}`);
    }
}

// 4. Drop Database
export async function dropDatabase(): Promise<void> {
    try {
        const dbName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the database to drop',
        });
        if (!dbName) return;
        const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: `Are you sure you want to drop database '${dbName}'?`,
        });
        if (confirm !== 'Yes') return;
        if (!connection) throw new Error('No active database connection.');
        await connection.query(`DROP DATABASE \`${dbName}\``);
        vscode.window.showInformationMessage(`Database '${dbName}' dropped successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error dropping database: ${(error as Error).message}`);
    }
}

// 5. Show Tables in Database
export async function showTables(): Promise<void> {
    try {
        const dbName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the database to list tables from',
        });
        if (!dbName) return;
        if (!connection) throw new Error('No active database connection.');
        const [tables] = await connection.query(`SHOW TABLES FROM \`${dbName}\``);
        const tableNames = (tables as Record<string, string>[]).map(row => Object.values(row)[0]);
        await vscode.window.showQuickPick(tableNames, {
            placeHolder: 'Select a table',
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error showing tables: ${(error as Error).message}`);
    }
}

// 6. Create Table
export async function createTable(): Promise<void> {
    try {
        const dbName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the database to create the table in',
        });
        if (!dbName) return;
        const tableName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the new table',
        });
        if (!tableName) return;
        const schema = await vscode.window.showInputBox({
            placeHolder: 'Enter the table schema (e.g., id INT, name VARCHAR(50))',
        });
        if (!schema) return;
        if (!connection) throw new Error('No active database connection.');
        await connection.query(`CREATE TABLE \`${dbName}\`.\`${tableName}\` (${schema})`);
        vscode.window.showInformationMessage(`Table '${tableName}' created successfully in '${dbName}'.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error creating table: ${(error as Error).message}`);
    }
}

// 7. Drop Table
export async function dropTable(): Promise<void> {
    try {
        const dbName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the database containing the table',
        });
        if (!dbName) return;
        const tableName = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the table to drop',
        });
        if (!tableName) return;
        const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: `Are you sure you want to drop table '${tableName}'?`,
        });
        if (confirm !== 'Yes') return;
        if (!connection) throw new Error('No active database connection.');
        await connection.query(`DROP TABLE \`${dbName}\`.\`${tableName}\``);
        vscode.window.showInformationMessage(`Table '${tableName}' dropped successfully from '${dbName}'.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error dropping table: ${(error as Error).message}`);
    }
}

// 12. Execute SQL Query
export async function executeSQLQuery(): Promise<void> {
    try {
        const query = await vscode.window.showInputBox({
            placeHolder: 'Enter your SQL query',
        });
        if (!query) return;
        if (!connection) throw new Error('No active database connection.');
        const [rows] = await connection.query(query);
        vscode.window.showInformationMessage(`Query executed successfully: ${JSON.stringify(rows)}`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error executing query: ${(error as Error).message}`);
    }
}

// Register Commands
export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.connect', connectToDatabase));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.showDatabases', showDatabases));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.createDatabase', createDatabase));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.dropDatabase', dropDatabase));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.showTables', showTables));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.createTable', createTable));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.dropTable', dropTable));
    context.subscriptions.push(vscode.commands.registerCommand('yutools.mysql.executeSQLQuery', executeSQLQuery));
}

export function deactivate(): void {
    if (connection) connection.end();
}
