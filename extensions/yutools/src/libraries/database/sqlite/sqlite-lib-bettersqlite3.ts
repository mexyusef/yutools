import * as vscode from 'vscode';
import Database from 'better-sqlite3';

let sqliteClient: Database.Database | null = null;

// Deactivate SQLite Client
const deactivateSQLite = () => {
  if (sqliteClient) {
    sqliteClient.close();
    sqliteClient = null;
    vscode.window.showInformationMessage('Disconnected from SQLite.');
  }
};

const connectSQLite = vscode.commands.registerCommand('yutools.sqlite.connect', async () => {
  if (sqliteClient) {
    vscode.window.showInformationMessage('Already connected to SQLite.');
    return;
  }

  const dbPath = vscode.workspace.getConfiguration('yutools.databases.sqlite').get('dbPath', '');

  if (!dbPath) {
    vscode.window.showErrorMessage('SQLite database path is not configured. Please set it in the settings.');
    return;
  }

  try {
    sqliteClient = new Database(dbPath, { verbose: console.log });
    vscode.window.showInformationMessage(`Connected to SQLite database at ${dbPath}.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to connect to SQLite: ${error.message}`);
    sqliteClient = null; // Ensure the client is null if connection fails
  }
});

const disconnectSQLite = vscode.commands.registerCommand('yutools.sqlite.disconnect', async () => {
  if (!sqliteClient) {
    vscode.window.showInformationMessage('No active SQLite connection to disconnect.');
    return;
  }
  try {
    sqliteClient.close();
    sqliteClient = null;
    vscode.window.showInformationMessage('Disconnected from SQLite.');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to disconnect from SQLite: ${error.message}`);
  }
});

const executeSQLiteQuery = vscode.commands.registerCommand('yutools.sqlite.executeQuery', async () => {
  if (!sqliteClient) {
    vscode.window.showErrorMessage('No active SQLite connection. Please connect first.');
    return;
  }

  const query = await vscode.window.showInputBox({
    prompt: 'Enter the SQLite query to execute',
    placeHolder: 'SELECT * FROM table_name;',
  });

  if (!query) {
    vscode.window.showErrorMessage('Query input is empty.');
    return;
  }

  try {
    const result = sqliteClient.prepare(query).all();
    vscode.window.showInformationMessage(`Query executed successfully. Result: ${JSON.stringify(result)}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to execute query: ${error.message}`);
  }
});

// List Tables in the SQLite Database
const listSQLiteTables = vscode.commands.registerCommand('yutools.sqlite.listTables', async () => {
  if (!sqliteClient) {
    vscode.window.showErrorMessage('No active SQLite connection. Please connect first.');
    return;
  }

  try {
    const result = sqliteClient.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    const tables = result.map((row: any) => row.name).join(', ');
    vscode.window.showInformationMessage(`Tables in database: ${tables}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to list tables: ${error.message}`);
  }
});

// Create a Table
const createSQLiteTable = vscode.commands.registerCommand('yutools.sqlite.createTable', async () => {
  if (!sqliteClient) {
    vscode.window.showErrorMessage('No active SQLite connection. Please connect first.');
    return;
  }

  const tableName = await vscode.window.showInputBox({
    prompt: 'Enter the name of the table to create',
    placeHolder: 'my_table',
  });

  if (!tableName) {
    vscode.window.showErrorMessage('Table name is required.');
    return;
  }

  const columns = await vscode.window.showInputBox({
    prompt: 'Enter the columns for the table (e.g., id INTEGER PRIMARY KEY, name TEXT)',
    placeHolder: 'id INTEGER PRIMARY KEY, name TEXT',
  });

  if (!columns) {
    vscode.window.showErrorMessage('Columns definition is required.');
    return;
  }

  try {
    sqliteClient.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`).run();
    vscode.window.showInformationMessage(`Table ${tableName} created successfully.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to create table: ${error.message}`);
  }
});

// Insert Row into a Table
const insertSQLiteRow = vscode.commands.registerCommand('yutools.sqlite.insertRow', async () => {
  if (!sqliteClient) {
    vscode.window.showErrorMessage('No active SQLite connection. Please connect first.');
    return;
  }

  const tableName = await vscode.window.showInputBox({
    prompt: 'Enter the name of the table',
    placeHolder: 'my_table',
  });

  if (!tableName) {
    vscode.window.showErrorMessage('Table name is required.');
    return;
  }

  const columns = await vscode.window.showInputBox({
    prompt: 'Enter the column names (comma separated)',
    placeHolder: 'id, name',
  });

  const values = await vscode.window.showInputBox({
    prompt: 'Enter the values for the columns (comma separated)',
    placeHolder: '1, John Doe',
  });

  if (!columns || !values) {
    vscode.window.showErrorMessage('Both columns and values are required.');
    return;
  }

  try {
    const stmt = sqliteClient.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${values});`);
    stmt.run();
    vscode.window.showInformationMessage(`Row inserted into ${tableName}.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to insert row: ${error.message}`);
  }
});

// Delete Table
const deleteSQLiteTable = vscode.commands.registerCommand('yutools.sqlite.deleteTable', async () => {
  if (!sqliteClient) {
    vscode.window.showErrorMessage('No active SQLite connection. Please connect first.');
    return;
  }

  const tableName = await vscode.window.showInputBox({
    prompt: 'Enter the name of the table to delete',
    placeHolder: 'my_table',
  });

  if (!tableName) {
    vscode.window.showErrorMessage('Table name is required.');
    return;
  }

  try {
    sqliteClient.prepare(`DROP TABLE IF EXISTS ${tableName};`).run();
    vscode.window.showInformationMessage(`Table ${tableName} deleted successfully.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to delete table: ${error.message}`);
  }
});
