/* eslint-disable curly */
/* eslint-disable @blitz/comment-syntax */
/* eslint-disable @blitz/newline-before-return */
/* eslint-disable @blitz/lines-around-comment */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
// import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

type Writer = (content: string) => void;

interface ProcessPathOptions {
    extensions?: string[];
    includeHidden?: boolean;
    ignoreGitignore?: boolean;
    ignorePatterns?: string[];
    writer?: Writer;
    outputAsXml?: boolean;
}

let globalIndex = 1;

function printPath(writer: Writer, filePath: string, content: string, asXml: boolean): void {
    if (asXml) {
        printAsXml(writer, filePath, content);
    } else {
        printDefault(writer, filePath, content);
    }
}

function printDefault(writer: Writer, filePath: string, content: string): void {
    writer(`${filePath}\n`);
    writer(`---\n`);
    writer(`${content}\n`);
    writer(`---\n`);
}

function printAsXml(writer: Writer, filePath: string, content: string): void {
    writer(`<document index="${globalIndex}">\n`);
    writer(`  <source>${filePath}</source>\n`);
    writer(`  <document_content>\n${content}\n  </document_content>\n`);
    writer(`</document>\n`);
    globalIndex++;
}

function shouldIgnore(filePath: string, ignorePatterns: string[]): boolean {
    const baseName = path.basename(filePath);
    return ignorePatterns.some(pattern => new RegExp(pattern.replace('*', '.*')).test(baseName));
}

function readGitignore(directory: string): string[] {
    const gitignorePath = path.join(directory, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        return fs
            .readFileSync(gitignorePath, 'utf-8')
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'));
    }
    return [];
}

export async function processPath(
    inputPath: string,
    options: ProcessPathOptions = {}
): Promise<void> {
    const {
        extensions,
        includeHidden = false,
        ignoreGitignore = false,
        ignorePatterns = [],
        writer = console.log,
        outputAsXml = false,
    } = options;

    if (fs.lstatSync(inputPath).isFile()) {
        try {
            const content = fs.readFileSync(inputPath, 'utf-8');
            printPath(writer, inputPath, content, outputAsXml);
        } catch (error) {
            console.error(`Error reading file: ${inputPath}`, error);
        }
    } else if (fs.lstatSync(inputPath).isDirectory()) {
        let gitignoreRules: string[] = [];
        if (ignoreGitignore) {
            gitignoreRules = readGitignore(inputPath);
        }

        const stack: string[] = [inputPath];
        while (stack.length > 0) {
            const currentPath = stack.pop()!;
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);

                if (!includeHidden && entry.name.startsWith('.')) { continue; }
                if (shouldIgnore(fullPath, [...ignorePatterns, ...gitignoreRules])) { continue; }

                if (entry.isDirectory()) {
                    stack.push(fullPath);
                } else if (entry.isFile() && (!extensions || extensions.includes(path.extname(entry.name)))) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8');
                        printPath(writer, fullPath, content, outputAsXml);
                    } catch (error) {
                        console.error(`Error reading file: ${fullPath}`, error);
                    }
                }
            }
        }
    } else {
        console.error(`Path is neither a file nor a directory: ${inputPath}`);
    }
}

export async function processFiles(
    filePaths: string[],
    options: ProcessPathOptions = {}
): Promise<void> {
    console.log("Processing Files with Options:", options);
    console.log("Files to Process:", filePaths);
    const {
        extensions,
        includeHidden = false,
        ignoreGitignore = false,
        ignorePatterns = [],
        writer = console.log,
        outputAsXml = false,
    } = options;

    if (typeof writer !== 'function') {
        throw new TypeError('Provided writer is not a function');
    }

    for (const filePath of filePaths) {
        try {
            if (fs.lstatSync(filePath).isFile()) {
                // Process a single file
                if (
                    (!extensions || extensions.includes(path.extname(filePath))) &&
                    (!includeHidden && !path.basename(filePath).startsWith('.')) &&
                    !shouldIgnore(filePath, ignorePatterns)
                ) {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    printPath(writer, filePath, content, outputAsXml);
                }
            } else if (fs.lstatSync(filePath).isDirectory()) {
                // Process a directory
                let gitignoreRules: string[] = [];
                if (ignoreGitignore) {
                    gitignoreRules = readGitignore(filePath);
                }

                const stack: string[] = [filePath];
                while (stack.length > 0) {
                    const currentPath = stack.pop()!;
                    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

                    for (const entry of entries) {
                        const fullPath = path.join(currentPath, entry.name);

                        if (!includeHidden && entry.name.startsWith('.')) continue;
                        if (shouldIgnore(fullPath, [...ignorePatterns, ...gitignoreRules])) continue;

                        if (entry.isDirectory()) {
                            stack.push(fullPath);
                        } else if (entry.isFile() && (!extensions || extensions.includes(path.extname(entry.name)))) {
                            const content = fs.readFileSync(fullPath, 'utf-8');
                            printPath(writer, fullPath, content, outputAsXml);
                        }
                    }
                }
            } else {
                console.error(`Path is neither a file nor a directory: ${filePath}`);
            }
        } catch (error) {
            console.error(`Error processing path: ${filePath}`, error);
        }
    }
}
