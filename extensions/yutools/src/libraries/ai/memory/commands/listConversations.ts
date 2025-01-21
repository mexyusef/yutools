import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const listConversations = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.listConversations',
  async () => {
    const conversations = memory.getConversations();
    const content = conversations
      .map((conv) => `ID: ${conv.id}, Name: ${conv.name}, Created At: ${conv.created_at}`)
      .join('\n');

    const document = await vscode.workspace.openTextDocument({
      content: `=== Conversations ===\n${content}`,
      language: 'plaintext',
    });

    await vscode.window.showTextDocument(document);
  })