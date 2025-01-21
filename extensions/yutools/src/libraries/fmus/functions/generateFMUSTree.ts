import * as fs from 'fs';
import * as path from 'path';

export function generateFMUSTree(folderPath: string, fmusFilePath: string, indent = "", isRoot = true): string {
  const folderName = path.basename(folderPath); // Get the folder name from the full path
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  
  let result = "";

  // Only add the root marker and source file once at the root level
  if (isRoot) {
    // result += `--% index/fmus\n`;  // Root marker for the FMUS entry
    result += `${indent}${folderName},d\n`;
    result += `${indent + "  "}%__SOURCE_FILE__=${path.resolve(fmusFilePath)}\n`; // Absolute path to the generated FMUS file
    // isRoot = false;
  } else {
    result += `${indent}${folderName},d\n`;
  }
  // Iterate over the entries (files and subdirectories)
  for (const entry of entries) {
    const entryPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      result += generateFMUSTree(entryPath, fmusFilePath, indent + "  ", false); // Recursively handle subdirectories
    } else {
      result += `${indent}  ${entry.name},f(e=__SOURCE_FILE__=${entry.name})\n`; // Add file node
    }
  }

  return result;
}
