import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';
import { generateConversationIdFromName } from '../../utils/generateConversationId';

export const createConversation = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.createConversation',
  async () => {
    // const conversationId = await vscode.window.showInputBox({
    //   prompt: 'Enter a unique ID for the new conversation',
    // });
    const conversationName = await vscode.window.showInputBox({
      prompt: 'Enter a name for the new conversation',
    });
    const conversationId = generateConversationIdFromName(conversationName || 'Untitled');

    if (conversationId && conversationName) {
      memory.createConversation(conversationId, conversationName);
      vscode.window.showInformationMessage(`Created new conversation: ${conversationName}`);
    }
  });