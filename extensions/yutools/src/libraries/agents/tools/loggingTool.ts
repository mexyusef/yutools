// src/tools/loggingTool.ts

import { BaseTool } from "./baseTool";
import fs from "fs";
import path from "path";

export class LoggingTool extends BaseTool {
  private logFilePath: string;

  constructor(logFilePath: string) {
    super();
    this.logFilePath = path.resolve(logFilePath);
  }

  /**
   * Log a message to a file.
   *
   * @param args - The arguments containing the log message and level.
   * @returns The logging result.
   */
  public async execute(args: { message: string; level: string }): Promise<any> {
    try {
      console.log(`Logging message: ${args.message}`);
      const logEntry = `[${new Date().toISOString()}] [${args.level}] ${args.message}\n`;
      await fs.promises.appendFile(this.logFilePath, logEntry, "utf-8");
      return {
        message: "Log entry written successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to write log entry: ${error.message}`);
    }
  }
}