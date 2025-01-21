import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import GroqClientSingleton from '@/libraries/ai/groq/GroqClientSingleton';
import * as path from 'path';

const execAsync = promisify(exec);

export const gitCommitWithLLM = vscode.commands.registerCommand('yutools.git.gitCommitWithLLM', async () => {
  try {
    console.log('[gitCommitWithLLM] Starting gitCommitWithLLM command...');

    // Step 1: Get the Git repository root
    console.log('[gitCommitWithLLM] Getting Git repository root...');
    const repoRoot = await getGitRepoRoot();
    if (!repoRoot) {
      vscode.window.showErrorMessage('No Git repository found.');
      return;
    }
    console.log(`[gitCommitWithLLM] Git repository root: ${repoRoot}`);

    // Step 2: Get the Git diff
    console.log('[gitCommitWithLLM] Getting Git diff...');
    const diff = await getGitDiff(repoRoot);
    if (!diff) {
      vscode.window.showErrorMessage('No changes to commit.');
      return;
    }
    console.log(`[gitCommitWithLLM] Git diff: ${diff}`);

    // Step 3: Get the list of modified/created files
    console.log('[gitCommitWithLLM] Getting Git file changes...');
    const fileChanges = await getGitFileChanges(repoRoot);

    // Step 4: Generate a commit message using an LLM
    console.log('[gitCommitWithLLM] Generating commit message...');
    const commitMessage = await generateCommitMessage(diff, fileChanges);

    if (!commitMessage) {
      vscode.window.showErrorMessage('Failed to generate commit message.');
      return;
    }
    console.log(`[gitCommitWithLLM] Generated commit message: ${commitMessage}`);

    // Step 4: Show the commit message to the user for confirmation
    console.log('[gitCommitWithLLM] Prompting user for confirmation...');
    const confirmedMessage = await vscode.window.showInputBox({
      value: commitMessage,
      prompt: 'Review and edit the commit message:',
    });

    if (!confirmedMessage) {
      vscode.window.showInformationMessage('Commit canceled.');
      return;
    }
    console.log(`[gitCommitWithLLM] Confirmed commit message: ${confirmedMessage}`);

    // Step 5: Stage changes and commit
    console.log('[gitCommitWithLLM] Staging and committing changes...');
    await stageAndCommit(repoRoot, confirmedMessage);

    vscode.window.showInformationMessage('Commit successful!');
  } catch (error: any) {
    console.error(`Error in gitCommitWithLLM: ${error.message}`);
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
});

async function getGitRepoRoot(): Promise<string | null> {
  let dirPath: string | undefined;

  // Case 1: Use the active editor's file path
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && !activeEditor.document.isUntitled) {
    const filePath = activeEditor.document.uri.fsPath;
    dirPath = path.dirname(filePath); // Extract directory from file path
  }
  // Case 2: Fall back to the first workspace folder
  else if (vscode.workspace.workspaceFolders?.length) {
    dirPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // Already a directory
  }

  // If no dirPath is found, return null
  if (!dirPath) {
    console.error('No active editor or workspace folder found.');
    return null;
  }

  console.log(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ getGitRepoRoot
    Using directory path: ${dirPath}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `);

  try {
    // const { stdout } = await execAsync(`git rev-parse --show-toplevel`, { cwd: filePath });
    const { stdout } = await execAsync(`git rev-parse --show-toplevel`, { cwd: dirPath });
    // return stdout.trim();
    const repoRoot = stdout.trim();
    console.log(`Git repository root: ${repoRoot}`);
    return repoRoot;
  } catch (error) {
    console.error(`Error finding Git repository root: ${error}`);
    return null;
  }
}

// Use git diff --name-status to get a list of files that were modified (M), added (A), or deleted (D).
// This command is lightweight and avoids sending the entire diff to the LLM.
async function getGitFileChanges(repoRoot: string): Promise<string | null> {
  try {

    console.log(`
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ getGitFileChanges
      Using directory path: ${repoRoot}
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);

    const { stdout } = await execAsync(`git diff --name-status`, { cwd: repoRoot });
    return stdout.trim() || null;
  } catch (error) {
    console.error(`Error getting Git file changes: ${error}`);
    return null;
  }
}

async function getGitDiff(repoRoot: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`git diff`, {
      cwd: repoRoot,
      maxBuffer: 10 * 1024 * 1024, // Increase buffer size to 10 MB
    });
    // return stdout.trim() || null;
    const fullDiff = stdout.trim();
    const jumlah_baris_baca = 200;
    // Truncate the diff to the first 100 lines (adjust as needed)
    const truncatedDiff = fullDiff.split('\n').slice(0, jumlah_baris_baca).join('\n');
    return truncatedDiff || null;
  } catch (error: any) {
    // If the diff is still too large (e.g., exceeds 10 MB), 
    // fall back to using the list of modified files instead of the full diff
    if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
      console.warn('Diff too large, falling back to file changes.');
      return await getGitFileChanges(repoRoot); // Fall back to file changes
    }
    console.error(`Error getting Git diff: ${error}`);
    return null;
  }
}

async function generateCommitMessage(diff: string, fileChanges: string | null): Promise<string | null> {
  const groqClient = GroqClientSingleton.getInstance();

  const maxDiffLines = 2000; // Adjust as needed
  const diffLines = diff.split('\n').length;

  let prompt: string;

  // const prompt = `Summarize the following code changes into a single, clear, and concise Git commit message. Focus on the purpose of the changes, not the specific lines of code:\n\n${diff}`;
  if (diffLines > maxDiffLines && fileChanges) {
    // Use file changes if the diff is too large
    prompt = `Generate a concise Git commit message based on the following file changes:\n\n${fileChanges}`;
  } else {
    // Use the full diff if it's within the limit
    prompt = `Summarize the following code changes into a single, clear, and concise Git commit message. Focus on the purpose of the changes, not the specific lines of code:\n\n${diff}`;
  }

  try {
    const response = await groqClient.sendPrompt(prompt);
    return response;
  } catch (error) {
    console.error(`Error generating commit message: ${error}`);
    throw new Error('Failed to generate commit message using LLM.');
  }
}

async function stageAndCommit(repoRoot: string, message: string): Promise<void> {
  try {
    console.log('Staging changes...');
    await execAsync(`git add .`, { cwd: repoRoot });

    console.log('Committing changes...');
    await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: repoRoot });
  } catch (error) {
    console.error(`Error staging and committing: ${error}`);
    throw new Error('Failed to stage and commit changes.');
  }
}

// {
//   "contributes": {
//     "configuration": {
//       "title": "Yutools Git Commit",
//       "properties": {
//         "yutools.gitCommit.includeUntracked": {
//           "type": "boolean",
//           "default": false,
//           "description": "Whether to automatically include untracked files in the commit."
//         },
//         "yutools.gitCommit.llmApiKey": {
//           "type": "string",
//           "default": "",
//           "description": "Your LLM API key (e.g., OpenAI)."
//         }
//       }
//     }
//   }
// }

// const config = vscode.workspace.getConfiguration('yutools.gitCommit');
// const includeUntracked = config.get<boolean>('includeUntracked', false);
// const llmApiKey = config.get<string>('llmApiKey', '');

// if (includeUntracked) {
//   await execAsync(`git add -A`, { cwd: repoRoot });
// }
