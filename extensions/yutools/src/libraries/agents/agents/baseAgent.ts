import { BaseTool } from "../tools/baseTool";

export class BaseAgent {
  protected tools: Map<string, BaseTool>;

  constructor(tools: Map<string, BaseTool> = new Map()) {
    this.tools = tools;
  }

  /**
   * Execute a task using the agent's tools and logic.
   *
   * @param task - The task to execute.
   * @returns The result of the task execution.
   */
  public async executeTask(task: string): Promise<any> {
    throw new Error("Subclasses must implement executeTask.");
  }

  /**
   * Add a tool to the agent's toolbox.
   *
   * @param toolName - The name of the tool.
   * @param tool - The tool instance.
   */
  public addTool(toolName: string, tool: BaseTool): void {
    this.tools.set(toolName, tool);
  }

  /**
   * Remove a tool from the agent's toolbox.
   *
   * @param toolName - The name of the tool to remove.
   */
  public removeTool(toolName: string): void {
    this.tools.delete(toolName);
  }

  /**
   * Retrieve a tool by name.
   *
   * @param toolName - The name of the tool.
   * @returns The tool instance, or undefined if not found.
   */
  public getTool(toolName: string): BaseTool | undefined {
    return this.tools.get(toolName);
  }
}