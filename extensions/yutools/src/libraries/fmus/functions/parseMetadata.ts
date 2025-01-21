export function parseMetadata(metadata: string): { [key: string]: string } {
  const parsed: { [key: string]: string } = {};

  // Regex to match [tags:tag1,tag2|author:JohnDoe|date:2024-12-25]
  const metadataRegex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = metadataRegex.exec(metadata)) !== null) {
    const [fullMatch, tagsAndMetadata] = match;
    const [tagsPart, ...metadataParts] = tagsAndMetadata.split('|');
    const tags = tagsPart.split(',');

    parsed['tags'] = tags.join(','); // Save the tags part

    // Add the other metadata
    metadataParts.forEach((item) => {
      const [key, value] = item.split(':');
      if (key && value) {
        parsed[key.trim()] = value.trim(); // Save metadata item
      }
    });
  }

  return parsed;
}