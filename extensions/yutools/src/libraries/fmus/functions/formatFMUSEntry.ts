export function formatFMUSEntry(metadata: { [key: string]: string }, title: string, content: string): string {
  let entry = '--% [' + (metadata['tags'] || '') + ']\n' + title + '\n' + content + '\n--#';

  // Add other metadata if present
  Object.keys(metadata).forEach((key) => {
    if (key !== 'tags') {
      entry += `\n${key}:${metadata[key]}`;
    }
  });

  return entry;
}