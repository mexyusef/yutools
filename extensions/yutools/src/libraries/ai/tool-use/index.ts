export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
  handler: (...args: any[]) => Promise<any>; // Function to execute the tool
}

export class ToolRegistry {
  private tools: Record<string, ToolDefinition> = {};

  registerTool(tool: ToolDefinition) {
    this.tools[tool.name] = tool;
  }

  getTool(name: string): ToolDefinition | undefined {
    return this.tools[name];
  }

  getToolDefinitions(): Array<{
    type: "function";
    function: Omit<ToolDefinition, "handler">;
  }> {
    return Object.values(this.tools).map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }
}