import * as fs from 'fs';
import * as path from 'path';
import Redis from "ioredis";

function isBinaryFile(filePath: string, sampleSize = 512): boolean {
  const data = fs.readFileSync(filePath, { encoding: null }); // Read as raw buffer
  const length = Math.min(data.length, sampleSize); // Limit to sample size

  let binaryBytes = 0;
  for (let i = 0; i < length; i++) {
    const byte = data[i];
    // Allow common printable ASCII and control characters
    if (byte > 126 || (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
      binaryBytes++;
    }
  }

  // Heuristic: If more than 10% of the bytes are binary, classify as binary
  const binaryThreshold = length * 0.1;
  return binaryBytes > binaryThreshold;
}

export class FMUSItem {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content; // Content or Base64-encoded binary
  }
}

export class FMUSLibrary {

  // entries: Map<string, { title: string, content: string }>;
  // entries: Map<string, FMUSItem> = new Map();
  entries: Map<string, FMUSItem>;

  constructor(private redisConnString?: string) {
    this.entries = new Map(); // In-memory storage for FMUS entries
  }

  // Static Methods for File Conversion
  static convertTextFileToFMUS(fullPath: string) {
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      return { header: fullPath, content: content };
    } catch (err: any) {
      console.error(`Error reading text file: ${err.message}`);
      return null;
    }
  }

  // Convert Binary File to FMUS Entry
  // static convertBinaryFileToFMUS(fullPath: string) {
  //   try {
  //     const content = fs.readFileSync(fullPath); // Read file as binary
  //     const base64Content = content.toString('base64'); // Convert binary to Base64
  //     return new FMUSItem(fullPath, base64Content);
  //   } catch (err: any) {
  //     console.error(`Error reading binary file: ${err.message}`);
  //     return null;
  //   }
  // }

  static convertBinaryFileToFMUS(fullPath: string) {
    try {
      const content = fs.readFileSync(fullPath);
      const base64Content = content.toString('base64');
      return { header: fullPath, content: base64Content };
    } catch (err: any) {
      console.error(`Error reading binary file: ${err.message}`);
      return null;
    }
  }

  static convertFileToFMUS(fullPath: string) {
    // const ext = path.extname(fullPath).toLowerCase();
    // if (['.txt', '.log', '.md'].includes(ext)) {
    if (!isBinaryFile(fullPath)) {
      return this.convertTextFileToFMUS(fullPath);
    } else {
      return this.convertBinaryFileToFMUS(fullPath);
    }
  }

  // library.addEntry('/path/to/sample.txt', 'Sample text content');
  // console.log('Entries after adding:', [...library.entries.values()]);
  // library.addEntry('/path/to/another.txt', 'This is a test entry.');
  // library.addEntry('/path/to/example.txt', 'This example is for testing purposes.');
  // const results = library.queryByContent('test');
  // console.log('Query Results:', results);
  addEntry(title: string, content: string) {
    if (this.entries.has(title)) {
      throw new Error(`Entry with title "${title}" already exists.`);
    }
    // this.entries.set(title, { title, content });
    this.entries.set(title, new FMUSItem(title, content));
    console.log(`Added entry: ${title}`);
    return this.entries.get(title);
  }

  // library.removeEntry('/path/to/sample.txt');
  // console.log('Entries after removing:', [...library.entries.values()]);
  removeEntry(title: string) {
    if (!this.entries.has(title)) {
      throw new Error(`Entry with title "${title}" not found.`);
    }
    const removedEntry = this.entries.get(title);
    this.entries.delete(title);
    console.log(`Removed entry: ${title}`);
    return removedEntry;
  }

  // removeEntry(title: string) {
  //   if (!this.entries.has(title)) {
  //     throw new Error(`Entry with title "${title}" not found.`);
  //   }
  //   return this.entries.delete(title);
  // }

  // 7. Query Entries by Content
  queryByContent(query: string) {
    const results = [];
    for (const [title, entry] of this.entries) {
      if (entry.content.includes(query)) {
        results.push(entry);
      }
    }
    console.log(`Query found ${results.length} entries containing "${query}"`);
    return results;
  }

  // 9. Batch Add Entries from Text Files or Binary Files
  // const files = ['/path/to/file1.txt', '/path/to/image.png', '/path/to/document.pdf'];
  // const added = library.batchAddFiles(files);
  // console.log('Batch Added Entries:', added);
  batchAddFiles(filePaths: string[]) {
    const addedEntries = [];
    for (const filePath of filePaths) {
      try {
        const entry = FMUSLibrary.convertFileToFMUS(filePath);
        if (entry) {
          this.addEntry(entry.header, entry.content);
          addedEntries.push(entry);
        }
      } catch (err: any) {
        console.error(`Error processing file "${filePath}": ${err.message}`);
      }
    }
    console.log(`Batch added ${addedEntries.length} entries from files.`);
    return addedEntries;
  }

  getAllTitles() {
    return [...this.entries.keys()];
  }

  // library.exportToJSON('./exported_fmus.json');
  exportToJSON(outputPath: string) {
    const data = JSON.stringify([...this.entries.values()], null, 2);
    fs.writeFileSync(outputPath, data, 'utf-8');
    console.log(`Exported entries to ${outputPath}`);
  }

  // // Generate FMUS File Content based on Entries
  // private generateFMUSFileContent(): string {
  //   let content = '';
  //   for (const [title, entry] of this.entries) {
  //     content += `FMUS_ENTRY_START\n`;
  //     content += `Title: ${entry.title}\n`;
  //     content += `Body: ${entry.content}\n`;
  //     content += `FMUS_ENTRY_END\n\n`;
  //   }
  //   return content;
  // }

  // // Write FMUS Entries to a File Format (FMUS Format)
  // writeToFMUSFile(outputPath: string): void {
  //   try {
  //     const fmusContent = this.generateFMUSFileContent();
  //     fs.writeFileSync(outputPath, fmusContent, 'utf-8');
  //     console.log(`FMUS data written to file at ${outputPath}`);
  //   } catch (err: any) {
  //     console.error(`Error writing FMUS file: ${err.message}`);
  //   }
  // }

  // const library = new FMUSLibrary();
  // library.addEntry('entry1.txt', 'Content for entry 1');
  // library.addEntry('entry2.txt', 'Content for entry 2');
  // // Export the entries to a file in FMUS format
  // library.exportToFMUS('./output.fmus');
  exportToFMUS(outputPath: string): void {
    let fmusContent = '';

    // Iterate through the entries and format them according to FMUS specifications
    this.entries.forEach((item) => {
      fmusContent += `--% ${item.title}\n${item.content}\n--#\n\n`;
    });

    // Write the content to the specified file path
    try {
      fs.writeFileSync(outputPath, fmusContent, 'utf-8');
      console.log(`Exported entries to FMUS format at ${outputPath}`);
    } catch (err: any) {
      console.error(`Error writing FMUS file: ${err.message}`);
    }
  }

  // const library = new FMUSLibrary();
  // // Import entries from an FMUS file
  // library.importFromFMUS('./input.fmus');
  // // Now the entries will be available in memory and can be queried or exported
  // console.log(library.entries);
  importFromFMUS(inputPath: string): void {
    try {
      const fileContent = fs.readFileSync(inputPath, 'utf-8');

      // Split the file content into individual entries based on the FMUS format
      const entryRegex = /--% (.+?)\n([\s\S]+?)\n--#/g;
      let match: RegExpExecArray | null;

      // Iterate over matches and add entries to the library
      while ((match = entryRegex.exec(fileContent)) !== null) {
        const header = match[1].trim();  // The title (path)
        const body = match[2].trim();    // The body content (file content)

        // Add the entry to the library
        this.addEntry(header, body);
      }

      console.log(`Successfully imported entries from ${inputPath}`);
    } catch (err: any) {
      console.error(`Error importing FMUS file: ${err.message}`);
    }
  }

  // Modify Entry Title
  modifyTitle(oldTitle: string, newTitle: string) {
    if (!this.entries.has(oldTitle)) {
      throw new Error(`Entry with title "${oldTitle}" not found.`);
    }
    if (this.entries.has(newTitle)) {
      throw new Error(`An entry with title "${newTitle}" already exists.`);
    }
    const entry = this.entries.get(oldTitle);
    if (entry) {
      this.entries.delete(oldTitle); // Remove old entry
      entry.title = newTitle; // Update title
      this.entries.set(newTitle, entry); // Add updated entry
      console.log(`Title changed from "${oldTitle}" to "${newTitle}"`);
    }
  }

  // Modify Entry Content
  modifyContent(title: string, newContent: string) {
    if (!this.entries.has(title)) {
      throw new Error(`Entry with title "${title}" not found.`);
    }
    const entry = this.entries.get(title);
    if (entry) {
      entry.content = newContent; // Update content
      console.log(`Content updated for entry "${title}"`);
    }
  }

  // const library = new FMUSLibrary();
  // // Add entry with default title length of 50
  // library.addEntryFromText("This is a sample text that demonstrates how the method works in detail.");  
  // // Add entry with custom title length
  // library.addEntryFromText("Another example text for creating an entry.", 30);

  // Add Entry from a Text
  addEntryFromText(text: string, titleLength: number = 50) {
    if (text.length === 0) {
      throw new Error("Text cannot be empty.");
    }

    const title = text.length > titleLength
      ? text.slice(0, titleLength).trim() + "..."
      : text;

    if (this.entries.has(title)) {
      throw new Error(`Entry with title "${title}" already exists.`);
    }

    this.addEntry(title, text); // Use the existing addEntry method
    console.log(`Added entry from text with title "${title}"`);
  }

  // const library = new FMUSLibrary();
  // library.processFolder("./example-folder");
  // library.entries.forEach((item, key) => {
  //   console.log(`Key: ${key}, Title: ${item.title}, Content: ${item.content}`);
  // });
  processFolder(folderPath: string): void {
    const resolvedFolderPath = path.resolve(folderPath);

    const processFile = (filePath: string, rootPath: string) => {
      const relativePath = path.relative(rootPath, filePath);
      const isBinary = isBinaryFile(filePath);
      const content = isBinary
        ? fs.readFileSync(filePath).toString("base64")
        : fs.readFileSync(filePath, "utf8");
      const item = new FMUSItem(relativePath, content);
      this.entries.set(relativePath, item);
    };

    const traverseFolder = (currentPath: string, rootPath: string) => {
      const items = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(currentPath, item.name);

        if (item.isDirectory()) {
          traverseFolder(itemPath, rootPath);
        } else if (item.isFile()) {
          processFile(itemPath, rootPath);
        }
      }
    };

    traverseFolder(resolvedFolderPath, resolvedFolderPath);
  }

  async exportToRedis(): Promise<void> {
    if (!this.redisConnString) {
      throw new Error("Redis connection string is not provided");
    }

    const redis = new Redis(this.redisConnString);

    try {
      for (const [key, value] of this.entries) {
        await redis.hset(key, {
          title: value.title,
          content: value.content,
        });
      }
      console.log("Export to Redis completed.");
    } finally {
      redis.disconnect();
    }
  }

  async importFromRedis(): Promise<void> {
    if (!this.redisConnString) {
      throw new Error("Redis connection string is not provided");
    }

    const redis = new Redis(this.redisConnString);

    try {
      const keys = await redis.keys("*");

      for (const key of keys) {
        const data = await redis.hgetall(key);

        if (data.title && data.content) {
          const item = new FMUSItem(data.title, data.content);
          this.entries.set(key, item);
        }
      }
      console.log("Import from Redis completed.");
    } finally {
      redis.disconnect();
    }
  }

  // pattern: A glob-style pattern to filter keys (default is "*" to match all keys).
  // pageSize: Number of keys to fetch in one SCAN iteration (default is 10).
  // cursor: The starting cursor for SCAN (default is "0").
  // Returns:
  // keys: Array of keys fetched in the current page.
  // nextCursor: Cursor to use for the next page. If the cursor is "0", it indicates the end of iteration.
  async listRedisKeys(
    pattern: string = "*",
    pageSize: number = 10,
    cursor: string = "0"
  ): Promise<{ keys: string[]; nextCursor: string }> {
    if (!this.redisConnString) {
      throw new Error("Redis connection string is not provided");
    }

    const redis = new Redis(this.redisConnString);
    let keys: string[] = [];
    let nextCursor = "0";

    try {
      // Use SCAN to fetch keys
      const [newCursor, fetchedKeys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        pageSize
      );

      keys = fetchedKeys;
      nextCursor = newCursor;
    } finally {
      redis.disconnect();
    }

    return { keys, nextCursor };
  }
  // const library = new FMUSLibrary("redis://user:password@localhost:6379");
  // (async () => {
  //   let cursor = "0";
  //   const pattern = "*";
  //   const pageSize = 10;
  //   do {
  //     const { keys, nextCursor } = await library.listRedisKeys(pattern, pageSize, cursor);
  //     console.log("Fetched keys:", keys);
  //     // Update the cursor for the next iteration
  //     cursor = nextCursor;
  //   } while (cursor !== "0");
  // })();

  exportToFile(filePath: string): void {
    const fileContent = JSON.stringify(
      Array.from(this.entries.entries()),
      null,
      2
    );
    fs.writeFileSync(filePath, fileContent, "utf8");
    console.log(`Exported to file: ${filePath}`);
  }

  importFromFile(filePath: string): void {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedEntries: [string, FMUSItem][] = JSON.parse(fileContent);

    this.entries = new Map(parsedEntries);
    console.log(`Imported from file: ${filePath}`);
  }

}
