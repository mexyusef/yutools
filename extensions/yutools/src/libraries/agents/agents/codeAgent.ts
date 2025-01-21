import { BaseAgent } from "./baseAgent";
import { BaseTool } from "../tools/baseTool";
import { AgentExecutionError } from "../utils/errorHandling";

export class CodeAgent extends BaseAgent {
  private pythonInterpreter: BaseTool;

  constructor(tools: Map<string, BaseTool> = new Map()) {
    super(tools);
    this.pythonInterpreter = this.getTool("python_interpreter")!;

    if (!this.pythonInterpreter) {
      throw new AgentExecutionError("Python interpreter tool not found.");
    }
  }

  /**
   * Execute a code task using the Python interpreter.
   *
   * @param task - The code task to execute.
   * @returns The result of the code execution.
   */
  public async executeTask(task: string): Promise<any> {
    try {
      const result = await this.pythonInterpreter.execute({ code: task });
      return result;
    } catch (error: any) {
      throw new AgentExecutionError(`Code execution failed: ${error.message}`);
    }
  }
}