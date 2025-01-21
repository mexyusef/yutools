import { BaseAgent } from "./baseAgent";
import { BaseTool } from "../tools/baseTool";
import { BaseMemory } from "../interfaces/memory";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class CustomTaskPlanner extends BaseAgent {
  private llm: ChatOpenAI;
  private memory: BaseMemory;

  constructor(llm: ChatOpenAI, tools: Map<string, BaseTool>, memory: BaseMemory) {
    super(tools); // Pass `tools` to the base class constructor
    this.llm = llm;
    this.memory = memory;
  }

  private async generatePlan(task: string): Promise<string[]> {
    try {
      const prompt = `Break down the following task into smaller steps:
Task: ${task}
Steps:`;
      const response = await this.llm.invoke([new SystemMessage(prompt)]);
      
      // Handle different types of content
      let content: string;
      if (typeof response.content === "string") {
        content = response.content;
      } else {
        content = response.content.map((item) => {
          if ('text' in item) {
            return item.text;
          }
          return ''; // Handle other types of content if necessary
        }).join("\n");
      }

      const steps = content.split("\n").filter((step: string) => step.trim() !== "");
      return steps;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate plan: ${error.message}`);
      }
      throw new Error("Failed to generate plan due to an unknown error.");
    }
  }

  private async executeStep(step: string): Promise<string> {
    try {
      // Find the appropriate tool for the step
      const tool = Array.from(this.tools.values()).find((t) => t.canHandle(step));
      if (!tool) {
        throw new Error(`No tool found to handle step: ${step}`);
      }

      // Execute the step using the tool
      const result = await tool.execute({ input: step });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to execute step: ${error.message}`);
      }
      throw new Error("Failed to execute step due to an unknown error.");
    }
  }

  async executeTask(task: string): Promise<any> {
    try {
      // Generate a plan
      const steps = await this.generatePlan(task);

      // Execute each step sequentially
      let result: any;
      for (const step of steps) {
        result = await this.executeStep(step);
      }

      // Save the result to memory
      await this.memory.saveContext({ input: task }, { output: result });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Task execution failed: ${error.message}`);
      }
      throw new Error("Task execution failed due to an unknown error.");
    }
  }
}
