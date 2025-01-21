// src/tools/authenticationTool.ts

import { BaseTool } from "./baseTool";
import jwt from "jsonwebtoken";

export class AuthenticationTool extends BaseTool {
  private secretKey: string;

  constructor(secretKey: string) {
    super();
    this.secretKey = secretKey;
  }

  /**
   * Generate a JWT token for a user.
   *
   * @param args - The arguments containing the user ID and payload.
   * @returns The generated JWT token.
   */
  public async execute(args: { userId: string; payload: any }): Promise<any> {
    try {
      console.log(`Generating JWT token for user: ${args.userId}`);
      const token = jwt.sign(args.payload, this.secretKey, { expiresIn: "1h" });
      return {
        token: token,
        message: "JWT token generated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to generate JWT token: ${error.message}`);
    }
  }

  /**
   * Verify a JWT token.
   *
   * @param args - The arguments containing the token to verify.
   * @returns The decoded token payload.
   */
  public async verifyToken(args: { token: string }): Promise<any> {
    try {
      console.log(`Verifying JWT token`);
      const decoded = jwt.verify(args.token, this.secretKey);
      return {
        payload: decoded,
        message: "JWT token verified successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to verify JWT token: ${error.message}`);
    }
  }
}