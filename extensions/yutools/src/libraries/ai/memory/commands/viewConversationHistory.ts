import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const viewConversationHistory = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.viewConversationHistory',
  async () => {
    const history = memory.getHistory();
    const files = memory.getFiles();

    // Display the conversation history in a new text document
    const content = [
      '=== Conversation History ===',
      ...history.map((msg) => `${msg.role}: ${msg.content}`),
      '=== Uploaded Files ===',
      ...files.map((file) => `File: ${file.name} (${file.type}, ${file.size} bytes)`),
    ].join('\n');

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'plaintext',
    });

    await vscode.window.showTextDocument(document);
  });
