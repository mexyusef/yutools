import { BaseTool } from "./baseTool";
import crypto from "crypto";
import fs from "fs";

export class FileDecryptTool extends BaseTool {
  private algorithm: string = "aes-256-cbc";
  private key: Buffer;
  private iv: Buffer;

  constructor(key: string) {
    super();
    // this.key = crypto.createHash("sha256").update(key).digest("base64").substr(0, 32);
    // Use `digest()` to get a Buffer, then slice the first 32 bytes
    this.key = crypto.createHash("sha256").update(key).digest().subarray(0, 32);
    this.iv = crypto.randomBytes(16);
  }

  /**
   * Decrypt a file.
   *
   * @param args - The arguments containing the file path and output path.
   * @returns The decryption result.
   */
  public async execute(args: { filePath: string; outputPath: string }): Promise<any> {
    try {
      console.log(`Decrypting file: ${args.filePath}`);
      const fileContent = await fs.promises.readFile(args.filePath);
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      const decrypted = Buffer.concat([decipher.update(fileContent), decipher.final()]);

      await fs.promises.writeFile(args.outputPath, decrypted);
      return {
        message: "File decrypted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to decrypt file: ${error.message}`);
    }
  }

}

