// src/tools/loggingTool.ts

import { BaseTool } from "./baseTool";
import winston from "winston";

export class LoggingToolWinston extends BaseTool {
  private logger: winston.Logger;

  constructor() {
    super();
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: "logs.log" }),
      ],
    });
  }

  /**
   * Log a message.
   *
   * @param args - The arguments containing the log message and level.
   * @returns The logging result.
   */
  public async execute(args: { message: string; level: string }): Promise<any> {
    try {
      console.log(`Logging message: ${args.message}`);
      this.logger.log(args.level, args.message);
      return {
        message: "Log entry written successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to write log entry: ${error.message}`);
    }
  }
}