import { exec } from 'child_process';

/**
 * Executes a Git command and returns its output.
 *
 * @param command - The Git command to execute (e.g., `git rev-parse HEAD`).
 * @param repoPath - The path to the Git repository.
 * @returns The output of the Git command.
 */
async function runGitCommand(command: string, repoPath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: repoPath }, (error, stdout, stderr) => {
			if (error) {
				reject(`Git command failed: ${error.message}`);
				return;
			}
			if (stderr) {
				reject(`Git command error: ${stderr}`);
				return;
			}
			resolve(stdout.trim());
		});
	});
}

/**
 * Gets the current Git commit hash of the repository.
 *
 * @param repoPath - The path to the Git repository.
 * @returns The current commit hash.
 */
export async function getCurrentCommitHash(repoPath: string): Promise<string> {
	return runGitCommand('git rev-parse HEAD', repoPath);
}

/**
 * Gets the name of the Git repository.
 *
 * @param repoPath - The path to the Git repository.
 * @returns The repository name.
 */
export async function getRepositoryName(repoPath: string): Promise<string> {
	const originUrl = await runGitCommand('git config --get remote.origin.url', repoPath);
	return originUrl.split('/').pop()?.replace('.git', '') || 'unknown-repo';
}

/**
 * Lists the modified files in the Git repository.
 *
 * @param repoPath - The path to the Git repository.
 * @returns An array of modified file paths.
 */
export async function getModifiedFiles(repoPath: string): Promise<string[]> {
	const output = await runGitCommand('git status --porcelain', repoPath);
	return output
		.split('\n')
		.filter((line) => line.trim().length > 0)
		.map((line) => line.slice(3)); // Skip the status prefix (e.g., ' M ')
}

// import {
//   getCurrentCommitHash,
//   getRepositoryName,
//   getModifiedFiles,
// } from './version-control';

// 1. Get the current commit hash
getCurrentCommitHash('/path/to/repo')
	.then((hash) => console.log('Current commit hash:', hash))
	.catch(console.error);

// 2. Get the repository name
getRepositoryName('/path/to/repo')
	.then((name) => console.log('Repository name:', name))
	.catch(console.error);

// 3. List modified files
getModifiedFiles('/path/to/repo')
	.then((files) => console.log('Modified files:', files))
	.catch(console.error);
