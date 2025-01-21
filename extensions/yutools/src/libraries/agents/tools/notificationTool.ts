// src/tools/notificationTool.ts

import { BaseTool } from "./baseTool";
import admin from "firebase-admin";

export class NotificationTool extends BaseTool {
  constructor() {
    super();
    admin.initializeApp({
      credential: admin.credential.cert("path/to/your/serviceAccountKey.json"),
    });
  }

  /**
   * Send a notification.
   *
   * @param args - The arguments containing the notification details.
   * @returns The notification sending result.
   */
  public async execute(args: { token: string; title: string; body: string }): Promise<any> {
    try {
      console.log(`Sending notification to token: ${args.token}`);
      const message = {
        notification: {
          title: args.title,
          body: args.body,
        },
        token: args.token,
      };

      const response = await admin.messaging().send(message);
      return {
        messageId: response,
        message: "Notification sent successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}