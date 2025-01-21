import * as vscode from 'vscode';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabaseConfig() {
	const config = vscode.workspace.getConfiguration('yutools.databases.supabase');
	return {
		url: config.get<string>('url') || '',
		apiKey: config.get<string>('apiKey') || '',
	};
}

function initSupabase(): SupabaseClient | null {
	const { url, apiKey } = getSupabaseConfig();
	if (!url || !apiKey) {
		vscode.window.showErrorMessage('Supabase URL or API Key is not configured.');
		return null;
	}
	return createClient(url, apiKey);
}

const listTables = async (): Promise<string[]> => {
	supabase = supabase || initSupabase();
	if (!supabase) return [];

	try {
		const { data, error } = await supabase.from('pg_tables').select('*').eq('schemaname', 'public');
		if (error) throw error;

		return data.map((table: any) => table.tablename);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error listing tables: ${error.message}`);
		return [];
	}
};


const listTablesCommand = vscode.commands.registerCommand('yutools.supabase.listTables', async () => {
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.from('pg_tables').select('*').eq('schemaname', 'public');
		if (error) throw error;

		const tableNames = data.map((table: any) => table.tablename);
		vscode.window.showQuickPick(tableNames, { title: 'Available Tables' });
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error listing tables: ${error.message}`);
	}
});

const insertRow = vscode.commands.registerCommand('yutools.supabase.insertRow', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	const rowData = await vscode.window.showInputBox({ prompt: 'Enter row data as JSON' });
	if (!rowData) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).insert(JSON.parse(rowData));
		if (error) throw error;

		vscode.window.showInformationMessage(`Row inserted into "${tableName}".`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error inserting row: ${error.message}`);
	}
});

const showDashboard = vscode.commands.registerCommand('yutools.supabase.showDashboard', async () => {
	const panel = vscode.window.createWebviewPanel(
		'supabaseDashboard',
		'Supabase Dashboard',
		vscode.ViewColumn.One,
		{}
	);

	panel.webview.html = `<h1>Supabase Dashboard</h1><p>Metrics and stats go here.</p>`;
});

const insertRowFromFile = vscode.commands.registerCommand('yutools.supabase.insertRowFromFile', async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor || !editor.document.fileName.endsWith('.json')) {
		vscode.window.showErrorMessage('Please open a JSON file to insert data.');
		return;
	}

	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	const rowData = editor.document.getText();
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).insert(JSON.parse(rowData));
		if (error) throw error;

		vscode.window.showInformationMessage(`Row inserted into "${tableName}".`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error inserting row: ${error.message}`);
	}
});


function handleSupabaseError(error: any, context: string) {
	if (error) {
		vscode.window.showErrorMessage(`Error in ${context}: ${error.message}`);
		return true;
	}
	return false;
}

const showDashboardNext = vscode.commands.registerCommand('yutools.supabase.showDashboard', async () => {
	const panel = vscode.window.createWebviewPanel(
		'supabaseDashboard',
		'Supabase Dashboard',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);

	panel.webview.html = `
    <h1>Supabase Dashboard</h1>
    <button onclick="listTables()">List Tables</button>
    <script>
      function listTables() {
        vscode.postMessage({ command: 'listTables' });
      }
    </script>
  `;

	panel.webview.onDidReceiveMessage(async (message) => {
		if (message.command === 'listTables') {
			const tables = await listTables();
			panel.webview.html += `<p>Tables: ${tables.join(', ')}</p>`;
		}
	});
});


const subscribeToTable = vscode.commands.registerCommand('yutools.supabase.subscribeToTable', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to subscribe to' });
	if (!tableName) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	const subscription = supabase
		.channel('table-changes')
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: tableName },
			(payload: any) => {
				vscode.window.showInformationMessage(`Change in ${tableName}: ${JSON.stringify(payload)}`);
			}
		)
		.subscribe();

	vscode.window.showInformationMessage(`Subscribed to changes in "${tableName}".`);

	// Optionally, provide a way to unsubscribe
	const unsubscribe = async () => {
		await subscription.unsubscribe();
		vscode.window.showInformationMessage(`Unsubscribed from "${tableName}".`);
	};

	// Add a command to unsubscribe
	vscode.commands.registerCommand('yutools.supabase.unsubscribeFromTable', unsubscribe);
});


// const backupDatabase = vscode.commands.registerCommand('yutools.supabase.backupDatabase', async () => {
// 	supabase = supabase || initSupabase();
// 	if (!supabase) return;

// 	try {
// 		const { data, error } = await supabase.rpc('backup_database');
// 		if (error) throw error;

// 		const filePath = await vscode.window.showSaveDialog({ filters: { SQL: ['sql'] } });
// 		if (filePath) {
// 			await vscode.workspace.fs.writeFile(filePath, Uint8Array.from(Buffer.from(data)));
// 			vscode.window.showInformationMessage(`Database backup saved to ${filePath.fsPath}.`);
// 		}
// 	} catch (error: any) {
// 		vscode.window.showErrorMessage(`Error backing up database: ${error.message}`);
// 	}
// });

const backupDatabase = vscode.commands.registerCommand('yutools.supabase.backupDatabase', async () => {
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.rpc('backup_database');
		if (error) throw error;

		const filePath = await vscode.window.showSaveDialog({ filters: { SQL: ['sql'] } });
		if (filePath) {
			const encoder = new TextEncoder();
			await vscode.workspace.fs.writeFile(filePath, encoder.encode(data));
			// await vscode.workspace.fs.writeFile(filePath, Buffer.from(data));
			vscode.window.showInformationMessage(`Database backup saved to ${filePath.fsPath}.`);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error backing up database: ${error.message}`);
	}
});

// const exportTableToCSV = vscode.commands.registerCommand('yutools.supabase.exportTableToCSV', async () => {
// 	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to export' });
// 	if (!tableName) return;

// 	supabase = supabase || initSupabase();
// 	if (!supabase) return;

// 	try {
// 		const { data, error } = await supabase.from(tableName).select('*');
// 		if (error) throw error;

// 		const csvData = data.map((row: any) => Object.values(row).join(',')).join('\n');
// 		const filePath = await vscode.window.showSaveDialog({ filters: { CSV: ['csv'] } });
// 		if (filePath) {
// 			await vscode.workspace.fs.writeFile(filePath, Uint8Array.from(Buffer.from(csvData)));
// 			vscode.window.showInformationMessage(`Table "${tableName}" exported to ${filePath.fsPath}.`);
// 		}
// 	} catch (error: any) {
// 		vscode.window.showErrorMessage(`Error exporting table: ${error.message}`);
// 	}
// });
const exportTableToCSV = vscode.commands.registerCommand('yutools.supabase.exportTableToCSV', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to export' });
	if (!tableName) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.from(tableName).select('*');
		if (error) throw error;

		const csvData = data.map((row: any) => Object.values(row).join(',')).join('\n');
		const filePath = await vscode.window.showSaveDialog({ filters: { CSV: ['csv'] } });
		if (filePath) {
			const encoder = new TextEncoder();
			await vscode.workspace.fs.writeFile(filePath, encoder.encode(csvData));
			// await vscode.workspace.fs.writeFile(filePath, Buffer.from(csvData));
			vscode.window.showInformationMessage(`Table "${tableName}" exported to ${filePath.fsPath}.`);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error exporting table: ${error.message}`);
	}
});


const runSQLQueryOld = vscode.commands.registerCommand('yutools.supabase.runSQLQuery', async () => {
	const query = await vscode.window.showInputBox({ prompt: 'Enter SQL query' });
	if (!query) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.rpc('execute_sql', { query });
		if (error) throw error;

		vscode.window.showInformationMessage(`Query executed successfully. Results: ${JSON.stringify(data)}`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error executing query: ${error.message}`);
	}
});

const runSQLQuery = vscode.commands.registerCommand('yutools.supabase.runSQLQuery', async () => {
	const query = await vscode.window.showInputBox({ prompt: 'Enter SQL query' });
	if (!query) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.rpc('execute_sql', { query });
		if (error) throw error;

		const panel = vscode.window.createWebviewPanel(
			'sqlQueryResults',
			'SQL Query Results',
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = `
      <h1>SQL Query Results</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error executing query: ${error.message}`);
	}
});

const importData = vscode.commands.registerCommand('yutools.supabase.importData', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name to import into' });
	if (!tableName) return;

	const fileUri = await vscode.window.showOpenDialog({
		filters: { 'Data Files': ['csv', 'json'] },
	});
	if (!fileUri || fileUri.length === 0) return;

	const filePath = fileUri[0].fsPath;
	const fileContent = await vscode.workspace.fs.readFile(fileUri[0]);
	const data = filePath.endsWith('.csv')
		? parseCSV(fileContent.toString())
		: JSON.parse(fileContent.toString());

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).insert(data);
		if (error) throw error;

		vscode.window.showInformationMessage(`Data imported into "${tableName}" successfully.`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error importing data: ${error.message}`);
	}
});

const parseCSV = (csv: string): any[] => {
	const lines = csv.split('\n');
	const headers = lines[0].split(',');
	return lines.slice(1).map((line) => {
		const values = line.split(',');
		return headers.reduce((obj, header, index) => {
			obj[header] = values[index];
			return obj;
		}, {} as any);
	});
};

const viewSchema = vscode.commands.registerCommand('yutools.supabase.viewSchema', async () => {
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.rpc('get_schema');
		if (error) throw error;

		const panel = vscode.window.createWebviewPanel(
			'schemaViewer',
			'Database Schema',
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = `
      <h1>Database Schema</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error fetching schema: ${error.message}`);
	}
});

const listUsers = vscode.commands.registerCommand('yutools.supabase.listUsers', async () => {
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.auth.admin.listUsers();
		if (error) throw error;

		const userEmails = data.users.map((user: any) => user.email);
		vscode.window.showQuickPick(userEmails, { title: 'Users' });
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error listing users: ${error.message}`);
	}
});

const fakeCreateSupabaseAccount = vscode.commands.registerCommand('yutools.supabase.createAccount', async () => {
	const email = await vscode.window.showInputBox({ prompt: 'Enter your email' });
	if (!email) return;

	const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });
	if (!password) return;

	// Mock account creation
	vscode.window.showInformationMessage(`Supabase account created for ${email}.`);
});

const authenticateSupabase = vscode.commands.registerCommand('yutools.supabase.authenticate', async () => {
	const email = await vscode.window.showInputBox({ prompt: 'Enter your email' });
	if (!email) return;

	const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });
	if (!password) return;

	// Mock authentication
	supabase = initSupabase();
	if (supabase) {
		vscode.window.showInformationMessage(`Authenticated as ${email}.`);
	} else {
		vscode.window.showErrorMessage('Authentication failed.');
	}
});

const createDatabase = vscode.commands.registerCommand('yutools.supabase.createDatabase', async () => {
	const dbName = await vscode.window.showInputBox({ prompt: 'Enter database name' });
	if (!dbName) return;

	// Mock database creation
	vscode.window.showInformationMessage(`Database "${dbName}" created successfully.`);
});

const createSampleData = vscode.commands.registerCommand('yutools.supabase.createSampleData', async () => {
	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		// Create tables
		await supabase.rpc('create_table', { name: 'products' });
		await supabase.rpc('create_table', { name: 'orders' });
		await supabase.rpc('create_table', { name: 'customers' });

		// Insert sample data
		await supabase.from('products').insert([
			{ id: 1, name: 'Laptop', price: 999.99 },
			{ id: 2, name: 'Smartphone', price: 499.99 },
		]);

		await supabase.from('customers').insert([
			{ id: 1, name: 'John Doe', email: 'john@example.com' },
			{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
		]);

		await supabase.from('orders').insert([
			{ id: 1, customer_id: 1, product_id: 1, quantity: 1 },
			{ id: 2, customer_id: 2, product_id: 2, quantity: 2 },
		]);

		vscode.window.showInformationMessage('Sample e-commerce data created successfully.');
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error creating sample data: ${error.message}`);
	}
});

const runQuery = vscode.commands.registerCommand('yutools.supabase.runQuery', async () => {
	const query = await vscode.window.showInputBox({ prompt: 'Enter SQL query' });
	if (!query) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.rpc('execute_sql', { query });
		if (error) throw error;

		const panel = vscode.window.createWebviewPanel(
			'queryResults',
			'Query Results',
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = `
      <h1>Query Results</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error executing query: ${error.message}`);
	}
});

// Create Row
const createRow = vscode.commands.registerCommand('yutools.supabase.createRow', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	const rowData = await vscode.window.showInputBox({ prompt: 'Enter row data as JSON' });
	if (!rowData) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).insert(JSON.parse(rowData));
		if (error) throw error;

		vscode.window.showInformationMessage(`Row inserted into "${tableName}".`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error inserting row: ${error.message}`);
	}
});

// Read Rows
const readRows = vscode.commands.registerCommand('yutools.supabase.readRows', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { data, error } = await supabase.from(tableName).select('*');
		if (error) throw error;

		const panel = vscode.window.createWebviewPanel(
			'tableData',
			`Data in ${tableName}`,
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = `
      <h1>Data in ${tableName}</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error reading rows: ${error.message}`);
	}
});

// Update Row
const updateRow = vscode.commands.registerCommand('yutools.supabase.updateRow', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	const rowId = await vscode.window.showInputBox({ prompt: 'Enter row ID to update' });
	if (!rowId) return;

	const rowData = await vscode.window.showInputBox({ prompt: 'Enter updated row data as JSON' });
	if (!rowData) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).update(JSON.parse(rowData)).eq('id', rowId);
		if (error) throw error;

		vscode.window.showInformationMessage(`Row updated in "${tableName}".`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error updating row: ${error.message}`);
	}
});

// Delete Row
const deleteRow = vscode.commands.registerCommand('yutools.supabase.deleteRow', async () => {
	const tableName = await vscode.window.showInputBox({ prompt: 'Enter table name' });
	if (!tableName) return;

	const rowId = await vscode.window.showInputBox({ prompt: 'Enter row ID to delete' });
	if (!rowId) return;

	supabase = supabase || initSupabase();
	if (!supabase) return;

	try {
		const { error } = await supabase.from(tableName).delete().eq('id', rowId);
		if (error) throw error;

		vscode.window.showInformationMessage(`Row deleted from "${tableName}".`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error deleting row: ${error.message}`);
	}
});
