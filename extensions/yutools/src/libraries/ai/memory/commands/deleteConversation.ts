import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const deleteConversation = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.deleteConversation',
  async () => {
    const conversations = memory.getConversations();
    const conversationNames = conversations.map((conv) => conv.name);

    const selectedName = await vscode.window.showQuickPick(conversationNames, {
      placeHolder: 'Select a conversation to delete',
    });

    if (selectedName) {
      const selectedConversation = conversations.find((conv) => conv.name === selectedName);
      if (selectedConversation) {
        memory.deleteConversation(selectedConversation.id);
        vscode.window.showInformationMessage(`Deleted conversation: ${selectedName}`);
      }
    }
  })