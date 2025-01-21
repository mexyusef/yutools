import * as vscode from 'vscode';
import { createRAGPipeline, visualizeRAGPipeline, executeRAGPipeline, debugRAGPipeline } from './rag_library';

const createWorkflow = vscode.commands.registerCommand('rag.createWorkflow', async () => {
  const query = await vscode.window.showInputBox({ prompt: 'Enter your query:' });
  const retriever = await vscode.window.showQuickPick(['VectorDB', 'BM25'], { placeHolder: 'Select a retriever' });
  const numResults = await vscode.window.showInputBox({ prompt: 'Number of results to retrieve:', value: '5' });
  const model = await vscode.window.showQuickPick(['OpenAI GPT-4', 'Cohere'], { placeHolder: 'Select a model' });

  if (query && retriever && numResults && model) {
    const workflow = createRAGPipeline({
      query,
      retriever,
      numResults: parseInt(numResults, 10),
      model,
    });
    vscode.window.showInformationMessage('RAG workflow created successfully!');
  }
});

const visualizeWorkflow = vscode.commands.registerCommand('rag.visualizeWorkflow', async () => {
  const workflows = visualizeRAGPipeline();
  const panel = vscode.window.createWebviewPanel(
    'ragVisualizer',
    'RAG Workflow Visualization',
    vscode.ViewColumn.One,
    {}
  );
  panel.webview.html = workflows; // Assume the lib returns HTML for now
});

const runQuery = vscode.commands.registerCommand('rag.runQuery', async () => {
  const query = await vscode.window.showInputBox({ prompt: 'Enter your query to run on the workflow:' });
  if (query) {
    const result = executeRAGPipeline(query);
    const panel = vscode.window.createWebviewPanel('ragResults', 'RAG Results', vscode.ViewColumn.Two, {});
    panel.webview.html = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
  }
});

const debugWorkflow = vscode.commands.registerCommand('rag.debugWorkflow', async () => {
  const debugResult = debugRAGPipeline();
  vscode.window.showInformationMessage(`Debug Info: ${JSON.stringify(debugResult)}`);
});

const visualizeWorkflow2 = vscode.commands.registerCommand('rag.visualizeWorkflow2', async () => {
  const workflow = visualizeRAGPipeline(); // Get the workflow graph from the library
  const panel = vscode.window.createWebviewPanel(
    'ragVisualizer',
    'RAG Workflow Visualization',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  // Use Mermaid for visualizing the workflow
  const diagram = `
    graph TD;
    A[Retriever] --> B[Ranker];
    B --> C[Generator];
  `;

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      <script>mermaid.initialize({ startOnLoad: true });</script>
    </head>
    <body>
      <div class="mermaid">${diagram}</div>
    </body>
    </html>
  `;
});

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    createWorkflow,
    runQuery,
    debugWorkflow,
    visualizeWorkflow,
    visualizeWorkflow2
  );
}

