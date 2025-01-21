import * as vscode from 'vscode';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

// Deactivate Supabase Client
const deactivateSupabase = () => {
  if (supabase) {
    supabase.auth.signOut();
    supabase = null;
    vscode.window.showInformationMessage('Disconnected from Supabase.');
  }
};

// Retrieve Supabase config
function getSupabaseConfig() {
  const config = vscode.workspace.getConfiguration('yutools.databases.supabase');
  return {
    url: config.get<string>('url') || '',
    apiKey: config.get<string>('apiKey') || '',
  };
}

// Initialize Supabase client
function initSupabase(): SupabaseClient | null {
  const { url, apiKey } = getSupabaseConfig();
  if (!url || !apiKey) {
    vscode.window.showErrorMessage('Supabase URL or API Key is not configured.');
    return null;
  }
  return createClient(url, apiKey);
}

// Command: List Tables
const listTables = vscode.commands.registerCommand('yutools.supabase.listTables', async () => {
  supabase = supabase || initSupabase();
  if (!supabase) return;

  try {
    const { data, error } = await supabase.from('pg_tables').select('*');
    if (error) throw error;

    const tableNames = data.map((table: any) => table.tablename);
    vscode.window.showQuickPick(tableNames, {
      title: 'Available Tables',
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error listing tables: ${error.message}`);
  }
});
// const listTables = vscode.commands.registerCommand('yutools.supabase.listTables', async () => {
//   const supabase = initSupabase();
//   if (!supabase) return;

//   try {
//     const { data, error } = await supabase.from('pg_tables').select('*').eq('schemaname', 'public');
//     if (error) throw error;

//     const tables = data.map((table: any) => table.tablename);
//     vscode.window.showQuickPick(tables, { title: 'Available Tables' });
//   } catch (error: any) {
//     vscode.window.showErrorMessage(`Error listing tables: ${error.message}`);
//   }
// });

// Command: Create Table
const createTable = vscode.commands.registerCommand('yutools.supabase.createTable', async () => {
  const tableName = await vscode.window.showInputBox({
    prompt: 'Enter the name of the table to create',
  });
  if (!tableName) return;

  supabase = supabase || initSupabase();
  if (!supabase) return;

  try {
    const { error } = await supabase.rpc('create_table', { name: tableName });
    if (error) throw error;

    vscode.window.showInformationMessage(`Table "${tableName}" created successfully.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error creating table: ${error.message}`);
  }
});
// const createTable = vscode.commands.registerCommand('yutools.supabase.createTable', async () => {
//   const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to create' });
//   if (!tableName) return;

//   const supabase = initSupabase();
//   if (!supabase) return;

//   try {
//     const { error } = await supabase.rpc('create_table', { name: tableName });
//     if (error) throw error;

//     vscode.window.showInformationMessage(`Table "${tableName}" created successfully.`);
//   } catch (error: any) {
//     vscode.window.showErrorMessage(`Error creating table: ${error.message}`);
//   }
// });

// Command: Insert Row
const insertRow = vscode.commands.registerCommand('yutools.supabase.insertRow', async () => {
  const tableName = await vscode.window.showInputBox({
    prompt: 'Enter the table name to insert into',
  });
  if (!tableName) return;

  const rowData = await vscode.window.showInputBox({
    prompt: 'Enter row data as JSON',
  });
  if (!rowData) return;

  supabase = supabase || initSupabase();
  if (!supabase) return;

  try {
    const { error } = await supabase.from(tableName).insert(JSON.parse(rowData));
    if (error) throw error;

    vscode.window.showInformationMessage(`Row inserted into "${tableName}" successfully.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error inserting row: ${error.message}`);
  }
});
// const insertRow = vscode.commands.registerCommand('yutools.supabase.insertRow', async () => {
//   const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
//   if (!tableName) return;

//   const rowData = await vscode.window.showInputBox({ prompt: 'Enter row data as JSON' });
//   if (!rowData) return;

//   const supabase = initSupabase();
//   if (!supabase) return;

//   try {
//     const { error } = await supabase.from(tableName).insert(JSON.parse(rowData));
//     if (error) throw error;

//     vscode.window.showInformationMessage(`Row inserted into "${tableName}".`);
//   } catch (error: any) {
//     vscode.window.showErrorMessage(`Error inserting row: ${error.message}`);
//   }
// });

// // Register all commands
// context.subscriptions.push(
//   listTables,
//   createTable,
//   insertRow
// );

const setSupabaseURL = vscode.commands.registerCommand('yutools.supabase.setURL', async () => {
  const newURL = await vscode.window.showInputBox({ prompt: 'Enter Supabase URL' });
  if (newURL) {
    await vscode.workspace.getConfiguration('yutools.databases.supabase').update('url', newURL, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Supabase URL updated.');
  }
});

const getSupabaseURL = vscode.commands.registerCommand('yutools.supabase.getURL', () => {
  const url = vscode.workspace.getConfiguration('yutools.databases.supabase').get('url', '');
  vscode.window.showInformationMessage(`Supabase URL: ${url}`);
});

const setSupabaseAPIKey = vscode.commands.registerCommand('yutools.supabase.setAPIKey', async () => {
  const newKey = await vscode.window.showInputBox({ prompt: 'Enter Supabase API Key', password: true });
  if (newKey) {
    await vscode.workspace.getConfiguration('yutools.databases.supabase').update('apiKey', newKey, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Supabase API Key updated.');
  }
});

const getSupabaseAPIKey = vscode.commands.registerCommand('yutools.supabase.getAPIKey', () => {
  const apiKey = vscode.workspace.getConfiguration('yutools.databases.supabase').get('apiKey', '');
  vscode.window.showInformationMessage(`Supabase API Key: ${apiKey}`);
});

const listDatabases = vscode.commands.registerCommand('yutools.supabase.listDatabases', async () => {
  // Supabase doesn't support listing databases directly via client
  vscode.window.showInformationMessage('Listing databases is not supported via Supabase API.');
});

const createDatabase = vscode.commands.registerCommand('yutools.supabase.createDatabase', async () => {
  // Supabase does not support creating databases directly via API
  vscode.window.showWarningMessage('Database creation is managed through Supabase Studio or PostgreSQL admin.');
});

const deleteDatabase = vscode.commands.registerCommand('yutools.supabase.deleteDatabase', async () => {
  vscode.window.showWarningMessage('Database deletion must be managed through Supabase Studio or PostgreSQL admin.');
});

const deleteTable = vscode.commands.registerCommand('yutools.supabase.deleteTable', async () => {
  const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to delete' });
  if (!tableName) return;

  const supabase = initSupabase();
  if (!supabase) return;

  try {
    const { error } = await supabase.rpc('drop_table', { name: tableName });
    if (error) throw error;

    vscode.window.showInformationMessage(`Table "${tableName}" deleted successfully.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error deleting table: ${error.message}`);
  }
});

const updateRow = vscode.commands.registerCommand('yutools.supabase.updateRow', async () => {
  // Implement similar logic for updating a row
});

const deleteRow = vscode.commands.registerCommand('yutools.supabase.deleteRow', async () => {
  // Implement similar logic for deleting a row
});

const queryRows = vscode.commands.registerCommand('yutools.supabase.queryRows', async () => {
  // Implement logic for querying rows
});

const listColumns = vscode.commands.registerCommand('yutools.supabase.listColumns', async () => {
  const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
  if (!tableName) return;

  const supabase = initSupabase();
  if (!supabase) return;

  try {
    const { data, error } = await supabase.from('information_schema.columns').select('*').eq('table_name', tableName);
    if (error) throw error;

    const columns = data.map((col: any) => `${col.column_name} (${col.data_type})`);
    vscode.window.showQuickPick(columns, { title: 'Columns in Table' });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error listing columns: ${error.message}`);
  }
});

const addColumn = vscode.commands.registerCommand('yutools.supabase.addColumn', async () => {
  // Implement logic for adding a column
});

const deleteColumn = vscode.commands.registerCommand('yutools.supabase.deleteColumn', async () => {
  // Implement logic for deleting a column
});

const updateColumn = vscode.commands.registerCommand('yutools.supabase.updateColumn', async () => {
  // Implement logic for updating a column
});
