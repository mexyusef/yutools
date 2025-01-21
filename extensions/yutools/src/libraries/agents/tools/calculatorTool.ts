import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { BaseTool } from "./baseTool";

const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

export class CalculatorTool extends BaseTool {
  constructor() {
    super();
  }

  async execute(args: { operation: string; number1: number; number2: number }): Promise<any> {
    try {
      const { operation, number1, number2 } = args;
      let result: number;

      switch (operation) {
        case "add":
          result = number1 + number2;
          break;
        case "subtract":
          result = number1 - number2;
          break;
        case "multiply":
          result = number1 * number2;
          break;
        case "divide":
          result = number1 / number2;
          break;
        default:
          throw new Error("Invalid operation.");
      }

      return { result, message: "Calculation completed successfully." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Calculator tool execution failed: ${error.message}`);
      }
      throw new Error("Calculator tool execution failed due to an unknown error.");
    }
  }
}