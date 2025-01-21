// src/tools/visitWebpageTool.ts

import { BaseTool } from "./baseTool";
import puppeteer from "puppeteer";

export class VisitWebpageTool extends BaseTool {
  /**
   * Visit a webpage and extract its content using Puppeteer.
   *
   * @param args - The arguments containing the URL to visit.
   * @returns The webpage content.
   */
  public async execute(args: { url: string }): Promise<any> {
    try {
      console.log(`Visiting webpage: ${args.url}`);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(args.url);

      const content = await page.evaluate(() => document.body.innerText);
      await browser.close();

      return {
        url: args.url,
        content: content,
        message: "Webpage content extracted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to visit webpage: ${error.message}`);
    }
  }
}