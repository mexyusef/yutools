import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { logger } from '@/yubantu/extension/logger';

// c:\users\usef\commands.json
const jsonFileName = 'commands.json';
const jsonFilePath = path.join(os.homedir(), jsonFileName);

export async function loadCommands(): Promise<{ label: string; value: string }[]> {
  logger.log(`commands file: ${jsonFilePath}`);
  if (!fs.existsSync(jsonFilePath)) {
    // Initialize the JSON file with default commands
    const defaultCommands = [
      { label: "Start Server", value: "npm start" },
      { label: "Build Project", value: "npm run build" },
      { label: "Custom Command", value: "__INPUT__" }
    ];
    fs.writeFileSync(jsonFilePath, JSON.stringify(defaultCommands, null, 2));
  }
  // Read and parse the JSON file
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  return JSON.parse(fileContent);
}