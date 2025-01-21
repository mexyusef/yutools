import { parseSelectedText } from "./parseSelectedText";

// Helper function to encode the selected text
export function encodeSelectedTextGagal(selectedText: string): string {
  return encodeURIComponent(JSON.stringify(selectedText));
}

export function encodeSelectedText(selectedText: string): string {
  // Try to parse the selected text as a JavaScript object
  const parsedObject = parseSelectedText(selectedText);

  // If parsing succeeds, encode the parsed object
  if (parsedObject) {
    return encodeURIComponent(JSON.stringify(parsedObject));
  }

  // If parsing fails, encode the selected text as a string
  return encodeURIComponent(JSON.stringify(selectedText));
}