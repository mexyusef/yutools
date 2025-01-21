async function writeFile(filePath: string, content: string) {
	const fs = require('fs').promises;
	await fs.writeFile(filePath, content);
}

export async function swapFileContent(filePath: string, newContent: string) {
	await writeFile(filePath, newContent); // Async file writing
}
