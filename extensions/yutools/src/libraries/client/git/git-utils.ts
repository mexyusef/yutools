import { execCommand, runCommandAsync } from '../command';

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
