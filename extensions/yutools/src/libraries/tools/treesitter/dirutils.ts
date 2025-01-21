import fs from 'fs';
import path from 'path';
import { printASTEntities } from './testTreeSitter';

/**
 * Recursively scan a directory for files with a specific extension.
 *
 * @param dir - The directory to scan.
 * @param extension - The file extension to filter by (e.g., '.py').
 * @returns An array of file paths.
 */
function scanDirectory(dir: string, extension: string): string[] {
  let files: string[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(scanDirectory(fullPath, extension)); // Recursively scan subdirectories
    } else if (item.isFile() && fullPath.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Analyze all files in a directory.
 *
 * @param dir - The directory to analyze.
 * @param extension - The file extension to filter by (e.g., '.py').
 */
export function analyzeDirectory(dir: string, extension: string) {
  const files = scanDirectory(dir, extension);
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf-8');
    console.log(`Analyzing file: ${file}`);
    printASTEntities(code);
  }
}

// analyzeDirectory('./src', '.py'); // Analyze all Python files in the 'src' directory