import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const switchConversation = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.switchConversation',
  async () => {
    const conversations = memory.getConversations();
    const conversationNames = conversations.map((conv) => conv.name);

    const selectedName = await vscode.window.showQuickPick(conversationNames, {
      placeHolder: 'Select a conversation to switch to',
    });

    if (selectedName) {
      const selectedConversation = conversations.find((conv) => conv.name === selectedName);
      if (selectedConversation) {
        memory.switchConversation(selectedConversation.id);
        vscode.window.showInformationMessage(`Switched to conversation: ${selectedName}`);
      }
    }
  });
