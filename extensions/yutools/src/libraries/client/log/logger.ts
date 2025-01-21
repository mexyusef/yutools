import { window } from 'vscode';
import { createLogger, format, transports } from 'winston';
// "winston": "^3.10.0",
// "winston-vscode": "^1.0.0"
// @ts-ignore
import VSCTransport from 'winston-vscode';

/**
 * Creates a Winston logger for VSCode with VSCTransport.
 *
 * @returns Configured logger instance.
 */
export function createVSCodeLogger() {
	const vscTransport = new VSCTransport({
		window,
		name: 'CodeStory',
	});

	return createLogger({
		level: 'info',
		format: format.combine(
			format.splat(),
			format.printf(({ message }: { message: any }) => message),
			format.errors({ stack: true })
		),
		transports: [vscTransport],
	});
}

// import { getGitRepoName, getGitRemoteUrl, getGitCurrentHash } from './utils/gitUtils';
// import { createVSCodeLogger } from './logger/logger';

// const logger = createVSCodeLogger();

// async function exampleUsage() {
//     const workingDirectory = '/path/to/your/repo';

//     try {
//         const repoName = await getGitRepoName(workingDirectory);
//         const remoteUrl = await getGitRemoteUrl(workingDirectory);
//         const currentHash = await getGitCurrentHash(workingDirectory);

//         logger.info(`Repo: ${repoName}, Remote: ${remoteUrl}, Hash: ${currentHash}`);
//     } catch (error) {
//         logger.error(`Error: ${error.message}`);
//     }
// }
