import { exec } from 'child_process';

export const execShellCommand = (cmd: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(`exec error: ${error}`);
				return;
			}
			if (stderr) {
				reject(`stderr: ${stderr}`);
				return;
			}
			resolve(stdout);
		});
	});
};
