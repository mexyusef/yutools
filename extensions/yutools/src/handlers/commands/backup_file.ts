import * as vscode from 'vscode';
import * as fs from 'fs';

// Function to backup a single file
export const backup_file = (filePath: string, backup_ext: string = 'bak'): string | false => {
	if (!fs.existsSync(filePath)) {
		vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
		return false;
	}
	const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
	const backupPath = `${filePath}.${timestamp}.${backup_ext}`;
	const currentContent = fs.readFileSync(filePath, 'utf-8');
	fs.writeFileSync(backupPath, currentContent);
	return backupPath;
};

// Function to backup multiple files
export const backup_files = (filePaths: string[], backup_ext: string = 'bak'): string[] | false => {
	const backupPaths: string[] = [];

	for (const filePath of filePaths) {
		const backupPath = backup_file(filePath, backup_ext);
		if (backupPath === false) {
			vscode.window.showErrorMessage(`Backup failed for file ${filePath}.`);
			return false;
		}
		backupPaths.push(backupPath);
	}

	return backupPaths;
};

// // Example usage of the backup_files function:
// const filesToBackup = [
// 	'C:\\path\\to\\file1.txt',
// 	'C:\\path\\to\\file2.txt',
// 	'C:\\path\\to\\file3.txt'
// ];

// backup_files(filesToBackup);
