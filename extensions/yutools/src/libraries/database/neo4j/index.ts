import * as vscode from 'vscode';
import { Driver, Session, auth, driver as createDriver } from 'neo4j-driver';

let driver: Driver | null = null;

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('yutools.databases');
    const neo4jUri: string | undefined = config.get('neo4j.uri');
    const neo4jUser: string | undefined = config.get('neo4j.username');
    const neo4jPassword: string | undefined = config.get('neo4j.password');

    if (!neo4jUri || !neo4jUser || !neo4jPassword) {
        vscode.window.showErrorMessage('Neo4j connection settings are not properly configured.');
        return;
    }

    const connectCommand = vscode.commands.registerCommand('yutools.neo4j.connect', async () => {
        if (driver) {
            vscode.window.showInformationMessage('Already connected to Neo4j.');
            return;
        }
        try {
            driver = createDriver(neo4jUri, auth.basic(neo4jUser, neo4jPassword));
            await driver.verifyConnectivity();
            vscode.window.showInformationMessage('Connected to Neo4j database.');
        } catch (error: unknown) {
            vscode.window.showErrorMessage(`Failed to connect to Neo4j: ${(error as Error).message}`);
        }
    });

    const disconnectCommand = vscode.commands.registerCommand('yutools.neo4j.disconnect', async () => {
        if (driver) {
            await driver.close();
            driver = null;
            vscode.window.showInformationMessage('Disconnected from Neo4j database.');
        } else {
            vscode.window.showWarningMessage('Not connected to any Neo4j database.');
        }
    });

    const listDatabasesCommand = vscode.commands.registerCommand('yutools.neo4j.listDatabases', async () => {
        if (!driver) {
            vscode.window.showWarningMessage('Please connect to a Neo4j database first.');
            return;
        }
        try {
            const session: Session = driver.session();
            const result = await session.run('SHOW DATABASES');
            session.close();

            const databases: string[] = result.records.map(record => record.get('name'));
            vscode.window.showQuickPick(databases, { placeHolder: 'Available databases' });
        } catch (error: unknown) {
            vscode.window.showErrorMessage(`Failed to list databases: ${(error as Error).message}`);
        }
    });

    const createDatabaseCommand = vscode.commands.registerCommand('yutools.neo4j.createDatabase', async () => {
        if (!driver) {
            vscode.window.showWarningMessage('Please connect to a Neo4j database first.');
            return;
        }
        const dbName: string | undefined = await vscode.window.showInputBox({ prompt: 'Enter the name of the new database' });
        if (!dbName) return;

        try {
            const session: Session = driver.session();
            await session.run(`CREATE DATABASE ${dbName}`);
            session.close();
            vscode.window.showInformationMessage(`Database '${dbName}' created successfully.`);
        } catch (error: unknown) {
            vscode.window.showErrorMessage(`Failed to create database: ${(error as Error).message}`);
        }
    });

    const dropDatabaseCommand = vscode.commands.registerCommand('yutools.neo4j.dropDatabase', async () => {
        if (!driver) {
            vscode.window.showWarningMessage('Please connect to a Neo4j database first.');
            return;
        }
        const dbName: string | undefined = await vscode.window.showInputBox({ prompt: 'Enter the name of the database to drop' });
        if (!dbName) return;

        try {
            const session: Session = driver.session();
            await session.run(`DROP DATABASE ${dbName}`);
            session.close();
            vscode.window.showInformationMessage(`Database '${dbName}' dropped successfully.`);
        } catch (error: unknown) {
            vscode.window.showErrorMessage(`Failed to drop database: ${(error as Error).message}`);
        }
    });

    const monitorDatabaseCommand = vscode.commands.registerCommand('yutools.neo4j.monitorDatabase', async () => {
        if (!driver) {
            vscode.window.showWarningMessage('Please connect to a Neo4j database first.');
            return;
        }
        try {
            const session: Session = driver.session();
            const result = await session.run('SHOW DATABASES');
            session.close();

            const databaseInfo = result.records.map(record => {
                return {
                    name: record.get('name'),
                    status: record.get('status'),
                    address: record.get('address'),
                };
            });

            vscode.window.showInformationMessage(JSON.stringify(databaseInfo, null, 2));
        } catch (error: unknown) {
            vscode.window.showErrorMessage(`Failed to monitor databases: ${(error as Error).message}`);
        }
    });

    context.subscriptions.push(
        connectCommand,
        disconnectCommand,
        listDatabasesCommand,
        createDatabaseCommand,
        dropDatabaseCommand,
        monitorDatabaseCommand
    );
}

/**
 * Deactivates the extension.
 */
export function deactivate(): void {
    if (driver) {
        driver.close();
        driver = null;
    }
}
