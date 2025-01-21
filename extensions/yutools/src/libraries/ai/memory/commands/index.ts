import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';
import { searchFileContent } from './searchFileContent';
import { viewConversationHistory } from './viewConversationHistory';
import { uploadFile } from './uploadFile';

// Initialize the PersistentMemoryWithFiles instance
let memory: PersistentMemoryWithFiles;

export function activate(context: vscode.ExtensionContext) {
  // Initialize the library with a database path and conversation ID
  const dbPath = context.globalStorageUri.fsPath + '/conversation.db';
  // memory = new PersistentMemoryWithFiles(dbPath, 'conversation_1', 'VS Code Extension');
  memory = new PersistentMemoryWithFiles(dbPath);

  context.subscriptions.push(
    searchFileContent(memory), // Register the "Search File Content" command
    uploadFile(memory), // Register the "Upload File to Conversation" command
    viewConversationHistory(memory), // Register the "View Conversation History" command
  );

}

export function deactivate() {
  // Clean up resources
  memory.close();
}