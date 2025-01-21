import * as fs from 'fs';

export interface FMUSEntry {
  title: string;
  content: string[];
}

export class FMUS {
  static START_MARKER = "--%";
  static END_MARKER = "--#";

  /**
   * Reads an FMUS file and extracts all entries.
   * @param filePath - Path to the FMUS file.
   * @returns Array of FMUSEntry objects.
   */
  static parseFile(filePath: string): FMUSEntry[] {
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return this.parseContent(content);
  }

  /**
   * Parses FMUS content string and extracts all entries.
   * @param content - String content of an FMUS file.
   * @returns Array of FMUSEntry objects.
   */
  static parseContent(content: string): FMUSEntry[] {
    const lines = content.split('\n');
    const entries: FMUSEntry[] = [];
    let currentEntry: FMUSEntry | null = null;

    for (const line of lines) {
      if (line.startsWith(this.START_MARKER)) {
        if (currentEntry) {
          throw new Error('Malformed FMUS file: Found a new entry without closing the previous one.');
        }
        const title = line.slice(this.START_MARKER.length).trim();
        currentEntry = { title, content: [] };
      } else if (line.startsWith(this.END_MARKER)) {
        if (!currentEntry) {
          throw new Error('Malformed FMUS file: Found an end marker without a start marker.');
        }
        entries.push(currentEntry);
        currentEntry = null;
      } else if (currentEntry) {
        currentEntry.content.push(line);
      }
    }

    if (currentEntry) {
      throw new Error('Malformed FMUS file: Missing an end marker for the last entry.');
    }

    return entries;
  }

  /**
   * Filters entries by title using a regex pattern.
   * @param entries - Array of FMUSEntry objects.
   * @param titleRegex - Regex to filter titles.
   * @returns Filtered entries matching the title regex.
   */
  static filterEntries(entries: FMUSEntry[], titleRegex: RegExp): FMUSEntry[] {
    return entries.filter(entry => titleRegex.test(entry.title));
  }

  /**
   * Extracts titles from an array of FMUSEntry objects.
   * @param entries - Array of FMUSEntry objects.
   * @returns Array of titles.
   */
  static getTitles(entries: FMUSEntry[]): string[] {
    return entries.map(entry => entry.title);
  }

  /**
   * Converts FMUSEntry objects back to FMUS format string.
   * @param entries - Array of FMUSEntry objects.
   * @returns FMUS formatted string.
   */
  static serializeEntries(entries: FMUSEntry[]): string {
    return entries
      .map(
        entry =>
          `${this.START_MARKER} ${entry.title}\n${entry.content.join('\n')}\n${this.END_MARKER}`
      )
      .join('\n');
  }

  /**
   * Saves FMUSEntry objects to an FMUS file.
   * @param filePath - Path to save the FMUS file.
   * @param entries - Array of FMUSEntry objects.
   */
  static saveToFile(filePath: string, entries: FMUSEntry[]): void {
    const content = this.serializeEntries(entries);
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  }
}

