import { execCommand, runCommandAsync } from "@/libraries/client/command";

/**
 * Retrieves the name of the Git repository from a working directory.
 *
 * @param workingDirectory - The directory to analyze.
 * @returns Repository name.
 */
export async function getGitRepoName(workingDirectory: string): Promise<string> {
	try {
		const { stdout } = await runCommandAsync(workingDirectory, 'git', ['rev-parse', '--show-toplevel']);
		return stdout.trim().split('/').pop() || 'unknown-repo';
	} catch {
		return 'no-git-repo';
	}
}

/**
 * Retrieves the remote URL of the Git repository.
 *
 * @param workingDirectory - The directory to analyze.
 * @returns Remote URL or error string.
 */
export async function getGitRemoteUrl(workingDirectory: string): Promise<string> {
	try {
		const { stdout } = await runCommandAsync(workingDirectory, 'git', ['remote', 'get-url', 'origin']);
		return stdout.trim();
	} catch {
		return 'no-git-remote';
	}
}

/**
 * Retrieves the current Git hash.
 *
 * @param workingDirectory - The directory to analyze.
 * @returns Git hash or error string.
 */
export async function getGitCurrentHash(workingDirectory: string): Promise<string> {
	try {
		const { stdout } = await runCommandAsync(workingDirectory, 'git', ['rev-parse', 'HEAD']);
		return stdout.trim();
	} catch {
		return 'no-git-hash';
	}
}

/**
 * Retrieves all files tracked by Git in the working directory.
 *
 * @param workingDirectory - The directory to analyze.
 * @returns List of file paths.
 */
export async function getFilesTrackedInWorkingDirectory(workingDirectory: string): Promise<string[]> {
	try {
		const { stdout } = await runCommandAsync(workingDirectory, 'git', ['ls-files']);
		return stdout.split('\n').filter(Boolean).map((file) => `${workingDirectory}/${file}`);
	} catch {
		return [];
	}
}

/**
 * Retrieves files touched in the last two weeks from Git commits.
 *
 * @param workingDirectory - The directory to analyze.
 * @returns List of file paths.
 */
export async function getFilesInLastCommit(workingDirectory: string): Promise<string[]> {
	const command = `
        git log --pretty="%H" --since="2 weeks ago" |
        while read commit_hash; do
            git diff-tree --no-commit-id --name-only -r $commit_hash;
        done |
        sort | uniq -c |
        awk -v prefix="$(git rev-parse --show-toplevel)/" '{ print prefix $2 }' |
        sort -k2 -rn
    `;

	try {
		const stdout = await execCommand(command, workingDirectory);
		return stdout.split('\n').filter(Boolean);
	} catch {
		return [];
	}
}

// Below is the implementation of some other important Git management commands.

/**
 * Command 6: Stage all changes
 */
export async function stageAllChanges(workingDirectory: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git add .`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Command 7: Commit changes
 */
export async function commitChanges(workingDirectory: string, message: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git commit -m "${message}"`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Command 8: Push changes to remote
 */
export async function pushChanges(workingDirectory: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git push`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Command 9: Pull changes from remote
 */
export async function pullChanges(workingDirectory: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git pull`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Command 10: Switch branches
 */
export async function switchBranch(workingDirectory: string, branchName: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git checkout ${branchName}`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Command 11: Create a new branch
 */
export async function createBranch(workingDirectory: string, branchName: string): Promise<void> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(`git checkout -b ${branchName}`, { cwd: workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Commands marked as implemented: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.
