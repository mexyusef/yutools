import { commentSymbols } from "./commentSymbols";

/**
 * Compresses a text file by removing empty lines and optionally removing line comments.
 * 
 * @param content The content of the text file as a string.
 * @param removeComments If true, removes line comments based on the file type.
 * @param fileExtension The file extension (e.g., 'js', 'ts', 'py', 'rb').
 * @returns The compressed content as a string.
 */
export function compressTextFile(content: string, removeComments: boolean = false, fileExtension: string): string {
  // Get the comment symbol based on the file extension
  const commentSymbol = commentSymbols[fileExtension] || '';

  // Split the content into lines
  const lines = content.split('\n');

  // Filter out empty lines and optionally lines with comments
  const compressedLines = lines.filter(line => {
    // Remove lines that are empty or contain only whitespace
    if (line.trim() === '') {
      return false;
    }

    // Optionally remove lines that are comments
    if (removeComments && commentSymbol && line.trim().startsWith(commentSymbol)) {
      return false;
    }

    return true;
  });

  // Join the filtered lines back into a single string
  return compressedLines.join('\n');
}