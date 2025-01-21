import * as vscode from 'vscode';
import { ApiConfig } from './types';

export const readFileContentOfUri = async (uri: vscode.Uri) => {
  return Buffer.from(
    await vscode.workspace.fs.readFile(uri)).toString('utf8').replace(/\r\n/g, '\n'
    ); // must remove windows \r or every line will appear different because of it
}


export const getApiConfig = () => {
  const apiConfig: ApiConfig = {
    anthropic: { apikey: vscode.workspace.getConfiguration('void').get('anthropicApiKey') ?? '' },
    openai: { apikey: vscode.workspace.getConfiguration('void').get('openAIApiKey') ?? '' },
    greptile: {
      apikey: vscode.workspace.getConfiguration('void').get('greptileApiKey') ?? '',
      githubPAT: vscode.workspace.getConfiguration('void').get('githubPAT') ?? '',
      repoinfo: {
        remote: 'github',
        repository: 'TODO',
        branch: 'main'
      }
    },
    ollama: {
      endpoint: vscode.workspace.getConfiguration('void.ollama').get('endpoint') ?? '',
      model: vscode.workspace.getConfiguration('void.ollama').get('model') ?? '',
    },
    whichApi: vscode.workspace.getConfiguration('void').get('whichApi') ?? ''
  }
  return apiConfig
}
