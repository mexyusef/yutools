import { exec } from 'child_process';

export const runCommand = (command: string, callback: (error: string | null, stdout: string, stderr: string) => void) => {
	exec(command, (error, stdout, stderr) => {
		callback(error ? error.message : null, stdout, stderr);
	});
};
