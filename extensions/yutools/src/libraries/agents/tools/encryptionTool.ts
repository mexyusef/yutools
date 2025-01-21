import { BaseTool } from "./baseTool";
import crypto from "crypto";

export class EncryptionTool extends BaseTool {
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
   * Encrypt data.
   *
   * @param args - The arguments containing the data to encrypt.
   * @returns The encrypted data.
   */
  public async execute(args: { data: string }): Promise<any> {
    try {
      console.log(`Encrypting data`);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(args.data, "utf8", "hex");
      encrypted += cipher.final("hex");
      return {
        encryptedData: encrypted,
        iv: this.iv.toString("hex"),
        message: "Data encrypted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to encrypt data: ${error.message}`);
    }
  }

  /**
   * Decrypt data.
   *
   * @param args - The arguments containing the encrypted data and IV.
   * @returns The decrypted data.
   */
  public async decrypt(args: { encryptedData: string; iv: string }): Promise<any> {
    try {
      console.log(`Decrypting data`);
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(args.iv, "hex"));
      let decrypted = decipher.update(args.encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return {
        decryptedData: decrypted,
        message: "Data decrypted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to decrypt data: ${error.message}`);
    }
  }

}


// const encryptionTool = new EncryptionTool("my-secret-key");
// // Encrypt data
// encryptionTool
//   .execute({ data: "Hello, world!" })
//   .then((result) => {
//     console.log("Encrypted Data:", result.encryptedData);
//     console.log("IV:", result.iv);

//     // Decrypt data
//     return encryptionTool.decrypt({
//       encryptedData: result.encryptedData,
//       iv: result.iv,
//     });
//   })
//   .then((result) => {
//     console.log("Decrypted Data:", result.decryptedData);
//   })
//   .catch((error) => {
//     console.error(error.message); // Handle errors
//   });
