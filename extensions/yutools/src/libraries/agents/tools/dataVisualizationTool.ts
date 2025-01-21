// src/tools/dataVisualizationTool.ts

import { BaseTool } from "./baseTool";
import { Chart } from "chart.js";

export class DataVisualizationTool extends BaseTool {
  /**
   * Generate a chart from data.
   *
   * @param args - The arguments containing the data and chart options.
   * @returns The chart image or configuration.
   */
  public async execute(args: { data: any[]; options: any }): Promise<any> {
    try {
      console.log(`Generating chart`);
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) {
        throw new Error("Failed to create canvas context.");
      }

      const chart = new Chart(ctx, {
        type: args.options.type || "bar",
        data: {
          labels: args.data.map((item) => item.label),
          datasets: [
            {
              label: args.options.label || "Dataset",
              data: args.data.map((item) => item.value),
            },
          ],
        },
      });

      return {
        chart: chart.toBase64Image(),
        message: "Chart generated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to generate chart: ${error.message}`);
    }
  }
}