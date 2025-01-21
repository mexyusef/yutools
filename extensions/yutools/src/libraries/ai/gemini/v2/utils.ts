/**
 * Removes the leading comment pattern (e.g., `#`, `//`) from a string.
 * @param input - The input string to process.
 * @returns A string with the leading comment pattern removed, if present.
 */
export function removeLeadingComment(input: string): string {
  // Regular expression to match leading comment patterns
  const commentPattern = /^\s*(#|\/\/)\s*/;

  // Replace the leading comment pattern with an empty string
  return input.replace(commentPattern, "");
}

/**
 * Removes the leading comment pattern (e.g., `#`, `//`) from a string.
 * @param input - The input string to process.
 * @returns An object with the processed string and a flag indicating if a comment was removed.
 */
export function removeLeadingCommentWithStatus(input: string): { processed: string; isComment: boolean } {
  const commentPattern = /^\s*(#|\/\/)\s*/;
  const isComment = commentPattern.test(input);
  const processed = input.replace(commentPattern, "");
  return { processed, isComment };
}
