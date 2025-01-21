// src/utils/parsing.ts

import { AgentParsingError } from "./errorHandling";

export function parseJsonBlob(jsonBlob: string): Record<string, any> {
  try {
    return JSON.parse(jsonBlob);
  } catch (error: any) {
    throw new AgentParsingError(`Failed to parse JSON blob: ${error.message}`);
  }
}

export function parseCodeBlob(codeBlob: string): string {
  // Basic validation for code blobs (e.g., ensure it's not empty)
  if (!codeBlob || typeof codeBlob !== "string") {
    throw new AgentParsingError("Invalid code blob: must be a non-empty string.");
  }
  return codeBlob;
}

export function truncateContent(content: string, maxLength: number = 1000): string {
  if (content.length <= maxLength) {
    return content;
  }
  return `${content.slice(0, maxLength)}...`;
}