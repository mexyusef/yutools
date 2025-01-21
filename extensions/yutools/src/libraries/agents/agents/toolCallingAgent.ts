// src/agents/toolCallingAgent.ts

import { BaseAgent } from "./baseAgent";
import { BaseTool } from "../tools/baseTool";
import { ToolCall } from "../tools/toolCall";
import { AgentExecutionError } from "../utils/errorHandling";

export class ToolCallingAgent extends BaseAgent {
  /**
   * Execute a tool call using the specified tool and arguments.
   *
   * @param toolCall - The tool call to execute.
   * @returns The result of the tool execution.
   */
  public async executeToolCall(toolCall: ToolCall): Promise<any> {
    const tool = this.getTool(toolCall.toolName);
    if (!tool) {
      throw new AgentExecutionError(`Tool not found: ${toolCall.toolName}`);
    }

    try {
      const result = await tool.execute(toolCall.arguments);
      return result;
    } catch (error: any) {
      throw new AgentExecutionError(`Tool execution failed: ${error.message}`);
    }
  }

  /**
   * Execute a task by parsing it into tool calls and executing them.
   *
   * @param task - The task to execute.
   * @returns The result of the task execution.
   */
  public async executeTask(task: string): Promise<any> {
    // Parse the task into tool calls (placeholder logic for now)
    const toolCalls = this.parseTaskIntoToolCalls(task);

    // Execute each tool call sequentially
    let result: any;
    for (const toolCall of toolCalls) {
      result = await this.executeToolCall(toolCall);
    }

    return result;
  }

  /**
   * Parse a task into a list of tool calls.
   *
   * @param task - The task to parse.
   * @returns A list of tool calls.
   */
  private parseTaskIntoToolCalls(task: string): ToolCall[] {
    // Placeholder logic: This should be replaced with actual parsing logic.
    // For now, assume the task is a JSON string representing a tool call.
    try {
      const toolCall = JSON.parse(task) as ToolCall;
      return [toolCall];
    } catch (error: any) {
      throw new AgentExecutionError(`Failed to parse task into tool calls: ${error.message}`);
    }
  }
}