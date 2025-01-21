import * as fs from 'fs';
import * as path from 'path';

export class JSONFileUtils {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * Reads and parses the JSON file.
     */
    private readJSON(): any {
        if (!fs.existsSync(this.filePath)) {
            throw new Error(`File does not exist: ${this.filePath}`);
        }

        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        try {
            return JSON.parse(fileContent);
        } catch (error: any) {
            throw new Error(`Error parsing JSON from file: ${this.filePath} - ${error.message}`);
        }
    }

    /**
     * Writes an object to the JSON file.
     */
    private writeJSON(data: any): void {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 4), 'utf-8');
    }

    /**
     * Reads the JSON file and returns its content.
     */
    public get(): any {
        return this.readJSON();
    }

    /**
     * Adds or updates an entry in the JSON file.
     * @param keys Array of keys representing the path to the entry.
     * @param value The value to set.
     */
    public set(keys: string[], value: any): void {
        const data = this.readJSON();
        let current = data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        this.writeJSON(data);
    }

    /**
     * Removes an entry from the JSON file.
     * @param keys Array of keys representing the path to the entry.
     */
    public delete(keys: string[]): void {
        const data = this.readJSON();
        let current = data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) {
                return; // Entry does not exist
            }
            current = current[key];
        }

        delete current[keys[keys.length - 1]];
        this.writeJSON(data);
    }

    /**
     * Modifies a specific value in the JSON file.
     * @param keys Array of keys representing the path to the entry.
     * @param newValue The new value to set.
     */
    public update(keys: string[], newValue: any): void {
        this.set(keys, newValue);
    }

    /**
     * Prints a selected part of the JSON file based on a path selector.
     *
     * @param selector A dot-separated string representing the path to an entry (e.g., "parent.child.key").
     * @returns The selected JSON value or `undefined` if the path does not exist.
     */
    public print(selector: string): any {
        const data = this.readJSON();
        const keys = selector.split('.');

        let current = data;
        for (const key of keys) {
            if (current[key] === undefined) {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }
}

// // Example Usage
// const configFilePath = path.join(
//     process.env.APPDATA || "",
//     "claude",
//     "config.json"
// );

// const jsonUtils = new JSONFileUtils(configFilePath);

// // Add entries
// jsonUtils.set(["mcpServers", "memory"], {
//     command: "npx",
//     args: ["-y", "@modelcontextprotocol/server-memory"]
// });

// jsonUtils.set(["mcpServers", "filesystem"], {
//     command: "npx",
//     args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
// });

// // Remove entries
// jsonUtils.delete(["mcpServers", "postgres"]);

// // Update specific values
// jsonUtils.update([
//     "mcpServers",
//     "github",
//     "env",
//     "GITHUB_PERSONAL_ACCESS_TOKEN"
// ], "new_token_value");
