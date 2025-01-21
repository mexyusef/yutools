import { Tool } from "langchain/tools";

export class CustomTool extends Tool {
  name: string;
  description: string;
  executeFunc: (input: string) => Promise<string>;

  constructor(name: string, description: string, executeFunc: (input: string) => Promise<string>) {
    super();
    this.name = name;
    this.description = description;
    this.executeFunc = executeFunc;
  }

  async _call(input: string): Promise<string> {
    return this.executeFunc(input);
  }
}

export abstract class BaseTool {
  abstract execute(args: any): Promise<any>;

  canHandle(input: string): boolean {
    // Default implementation: Assume all tools can handle any input
    return true;
  }

  toLangChainTool(): CustomTool {
    return new CustomTool(
      this.constructor.name,
      "A custom tool", // Add a description for your tool
      async (input: string) => {
        const result = await this.execute({ input });
        return result;
      }
    );
  }
}
