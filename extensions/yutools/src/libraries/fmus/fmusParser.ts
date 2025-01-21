import fs from 'fs';

export interface FMUSItem {
  header: string;
  body: string;
}

export class FMUSParser {
  static parseFile(filePath: string): FMUSItem[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return this.parse(content);
  }

  static parse(content: string): FMUSItem[] {
    const items: FMUSItem[] = [];
    const lines = content.split('\n');
    let currentItem: FMUSItem | null = null;

    for (const line of lines) {
      if (line.startsWith('--%')) {
        if (currentItem) {
          items.push(currentItem);
        }
        currentItem = { header: line.slice(3).trim(), body: '' };
      } else if (line.startsWith('--#')) {
        if (currentItem) {
          items.push(currentItem);
          currentItem = null;
        }
      } else if (currentItem) {
        currentItem.body += line + '\n';
      }
    }

    if (currentItem) {
      items.push(currentItem);
    }

    return items.map(item => ({
      header: item.header,
      body: item.body.trim(),
    }));
  }

  static stringify(items: FMUSItem[]): string {
    return items
      .map(item => `--% ${item.header}\n${item.body}\n--#`)
      .join('\n');
  }

  static writeToFile(filePath: string, items: FMUSItem[]): void {
    const content = this.stringify(items);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}
