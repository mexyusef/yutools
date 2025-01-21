// src/tools/emailTool.ts

import { BaseTool } from "./baseTool";
import nodemailer from "nodemailer";

export class EmailTool extends BaseTool {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });
  }

  /**
   * Send an email.
   *
   * @param args - The arguments containing the email details.
   * @returns The email sending result.
   */
  public async execute(args: { to: string; subject: string; text: string }): Promise<any> {
    try {
      console.log(`Sending email to: ${args.to}`);
      const mailOptions = {
        from: "your-email@gmail.com",
        to: args.to,
        subject: args.subject,
        text: args.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        messageId: info.messageId,
        message: "Email sent successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}