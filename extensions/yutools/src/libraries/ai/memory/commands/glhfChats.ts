import * as vscode from 'vscode';
import { GLHFLLMClientWithMemoryWithFiles } from '../../glhf/GLHFLLMClientWithMemoryWithFiles';

let llmClient: GLHFLLMClientWithMemoryWithFiles;

const switchConversation = vscode.commands.registerCommand('yutools.llm.chats.glhf.switchConversation', async () => {
  const conversationId = await vscode.window.showInputBox({
    prompt: 'Enter the conversation ID to switch to',
  });
  if (conversationId) {
    llmClient.switchConversation(conversationId);
    vscode.window.showInformationMessage(`Switched to conversation: ${conversationId}`);
  }
});

const chat = vscode.commands.registerCommand('yutools.llm.chats.glhf.chat', async () => {
  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your message',
  });
  if (userPrompt) {
    try {
      const response = await llmClient.chat(userPrompt);
      vscode.window.showInformationMessage(`Assistant: ${response}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error during chat: ${error}`);
    }
  }
});

const uploadFile = vscode.commands.registerCommand('yutools.llm.chats.glhf.uploadFile', async () => {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
  });
  if (fileUri && fileUri[0]) {
    const filePath = fileUri[0].fsPath;
    const fileName = filePath.split('/').pop() || 'file';
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.txt') ? 'text' : 'image';

    try {
      await llmClient.uploadFile(filePath, fileName, fileType);
      vscode.window.showInformationMessage(`Uploaded file: ${fileName}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error uploading file: ${error}`);
    }
  }
})

const getHistory = vscode.commands.registerCommand('yutools.llm.chats.glhf.getHistory', async () => {
  const history = llmClient.getHistory();
  if (history.length > 0) {
    const historyText = history
      .map((msg, index) => `${index + 1}. ${msg.role}: ${msg.content}`)
      .join('\n');
    vscode.window.showInformationMessage(`Conversation History:\n${historyText}`);
  } else {
    vscode.window.showInformationMessage('No conversation history found.');
  }
});

const getFiles = vscode.commands.registerCommand('yutools.llm.chats.glhf.getFiles', async () => {
  const files = llmClient.getFiles();
  if (files.length > 0) {
    const filesText = files
      .map((file, index) => `${index + 1}. ${file.name} (${file.type})`)
      .join('\n');
    vscode.window.showInformationMessage(`Uploaded Files:\n${filesText}`);
  } else {
    vscode.window.showInformationMessage('No files uploaded.');
  }
});

export function register_glhf_chats(context: vscode.ExtensionContext) {
  // Initialize the LLM client with a SQLite database
  const dbPath = context.globalStorageUri.fsPath + '/chats-glhf.sqlite';
  llmClient = new GLHFLLMClientWithMemoryWithFiles(dbPath);

  // Automatically start a default conversation
  const defaultConversationId = llmClient.startConversation('Default Conversation');
  console.log(`Started default conversation with ID: ${defaultConversationId}`);

  // Register commands
  context.subscriptions.push(
    chat,

    uploadFile,

    getHistory,

    getFiles,

    switchConversation,
    
  );

  // Push cleanup function to context.subscriptions
  context.subscriptions.push({
    dispose: () => {
      // Clean up resources
      llmClient.close();
      console.log('LLM client resources cleaned up.');
    },
  });

}

// export function deactivate() {
//   // Clean up resources
//   llmClient.close();
// }