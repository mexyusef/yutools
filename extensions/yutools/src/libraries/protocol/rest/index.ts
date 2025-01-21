import * as vscode from 'vscode';

interface RestRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
}

interface RestEnvironment {
  name: string;
  variables: Record<string, string>;
}

let currentRequest: RestRequest = {
  method: 'GET',
  url: '',
  headers: {},
  body: null
};

let environments: RestEnvironment[] = [];
let currentEnvironment: RestEnvironment | null = null;
let requestHistory: RestRequest[] = [];

export function activate(context: vscode.ExtensionContext) {
  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.rest.createRequest', createRequest),
    vscode.commands.registerCommand('yutools.rest.saveRequest', saveRequest),
    vscode.commands.registerCommand('yutools.rest.sendRequest', sendRequest),
    vscode.commands.registerCommand('yutools.rest.viewRequestHistory', viewRequestHistory),
    vscode.commands.registerCommand('yutools.rest.clearHistory', clearHistory),
    vscode.commands.registerCommand('yutools.rest.editHeaders', editHeaders),
    vscode.commands.registerCommand('yutools.rest.editBody', editBody),
    vscode.commands.registerCommand('yutools.rest.manageEnvironments', manageEnvironments),
    vscode.commands.registerCommand('yutools.rest.addEnvironmentVariable', addEnvironmentVariable),
    vscode.commands.registerCommand('yutools.rest.deleteEnvironmentVariable', deleteEnvironmentVariable),
    vscode.commands.registerCommand('yutools.rest.switchEnvironment', switchEnvironment)
  );
}

// Command Implementations
async function createRequest() {
  currentRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null
  };
  vscode.window.showInformationMessage('New REST request created.');
}

const saveRequest = async (context: vscode.ExtensionContext) => {
  const requestName = await vscode.window.showInputBox({
    prompt: 'Enter a name for this request:'
  });

  if (requestName) {
    await context.globalState.update(`request-${requestName}`, currentRequest);
    vscode.window.showInformationMessage(`Request '${requestName}' saved.`);
  }
}

async function sendRequest() {
  if (!currentRequest.url) {
    vscode.window.showErrorMessage('Request URL is not set.');
    return;
  }

  try {
    const response = await fetch(currentRequest.url, {
      method: currentRequest.method,
      headers: currentRequest.headers,
      body: currentRequest.body || undefined
    });

    const responseBody = await response.text();
    requestHistory.push(currentRequest);
    vscode.window.showInformationMessage('Request sent successfully. Check the output for the response.');
    const outputChannel = vscode.window.createOutputChannel('REST Response');
    outputChannel.appendLine(responseBody);
    outputChannel.show();
  } catch (error) {
    vscode.window.showErrorMessage('Error sending request: ' + error);
  }
}

async function viewRequestHistory() {
  if (requestHistory.length === 0) {
    vscode.window.showInformationMessage('No request history found.');
    return;
  }

  const items = requestHistory.map((req, index) => `${index + 1}. ${req.method} ${req.url}`);
  const choice = await vscode.window.showQuickPick(items, { placeHolder: 'Select a request to view' });

  if (choice) {
    const index = parseInt(choice.split('.')[0], 10) - 1;
    const selectedRequest = requestHistory[index];
    vscode.window.showInformationMessage(`Method: ${selectedRequest.method}\nURL: ${selectedRequest.url}\nHeaders: ${JSON.stringify(selectedRequest.headers, null, 2)}`);
  }
}

async function clearHistory() {
  requestHistory = [];
  vscode.window.showInformationMessage('Request history cleared.');
}

async function editHeaders() {
  const headersInput = await vscode.window.showInputBox({
    prompt: 'Enter headers as JSON (e.g., {"Content-Type": "application/json"}):'
  });

  try {
    currentRequest.headers = JSON.parse(headersInput || '{}');
    vscode.window.showInformationMessage('Headers updated.');
  } catch {
    vscode.window.showErrorMessage('Invalid JSON format for headers.');
  }
}

async function editBody() {
  const bodyInput = await vscode.window.showInputBox({
    prompt: 'Enter the request body:'
  });

  currentRequest.body = bodyInput || null;
  vscode.window.showInformationMessage('Body updated.');
}

async function manageEnvironments() {
  const action = await vscode.window.showQuickPick(['Add Environment', 'Delete Environment', 'View Environments'], {
    placeHolder: 'Select an action'
  });

  if (action === 'Add Environment') {
    const name = await vscode.window.showInputBox({ prompt: 'Enter environment name:' });
    if (name) {
      environments.push({ name, variables: {} });
      vscode.window.showInformationMessage(`Environment '${name}' added.`);
    }
  } else if (action === 'Delete Environment') {
    const name = await vscode.window.showQuickPick(environments.map(env => env.name), { placeHolder: 'Select environment to delete:' });
    if (name) {
      environments = environments.filter(env => env.name !== name);
      vscode.window.showInformationMessage(`Environment '${name}' deleted.`);
    }
  } else if (action === 'View Environments') {
    vscode.window.showInformationMessage(`Environments: ${environments.map(env => env.name).join(', ')}`);
  }
}

async function addEnvironmentVariable() {
  if (!currentEnvironment) {
    vscode.window.showErrorMessage('No environment selected.');
    return;
  }

  const key = await vscode.window.showInputBox({ prompt: 'Enter variable name:' });
  const value = await vscode.window.showInputBox({ prompt: 'Enter variable value:' });

  if (key && value) {
    currentEnvironment.variables[key] = value;
    vscode.window.showInformationMessage(`Variable '${key}' added to environment '${currentEnvironment.name}'.`);
  }
}

async function deleteEnvironmentVariable() {
  if (!currentEnvironment) {
    vscode.window.showErrorMessage('No environment selected.');
    return;
  }

  const key = await vscode.window.showQuickPick(Object.keys(currentEnvironment.variables), { placeHolder: 'Select variable to delete:' });

  if (key) {
    delete currentEnvironment.variables[key];
    vscode.window.showInformationMessage(`Variable '${key}' deleted from environment '${currentEnvironment.name}'.`);
  }
}

async function switchEnvironment() {
  const name = await vscode.window.showQuickPick(environments.map(env => env.name), { placeHolder: 'Select environment:' });

  if (name) {
    currentEnvironment = environments.find(env => env.name === name) || null;
    vscode.window.showInformationMessage(`Switched to environment '${name}'.`);
  }
}
