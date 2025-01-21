/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { processFiles, processPath } from './processPath.js';

async function processFolder() {
    const options = {
        extensions: ['.ts', '.js'],
        includeHidden: false,
        ignoreGitignore: true,
        ignorePatterns: ['*.log', '*.tmp'],
        writer: (content: string) => process.stdout.write(content),
        outputAsXml: false,
    };

    await processPath(
        './example-directory',
        options
    );
}

const paths = [
    '/path/to/file1.txt',
    '/path/to/directory',
    '/another/path/file2.md'
];

async function processMultipleFiles() {
    await processFiles(paths, {
        extensions: ['.txt', '.md'],
        includeHidden: false,
        ignorePatterns: ['node_modules', '*.log'],
        writer: (content: string) => console.log(content),
        outputAsXml: true,
    });
}

processFolder().catch(error => console.error(error));
