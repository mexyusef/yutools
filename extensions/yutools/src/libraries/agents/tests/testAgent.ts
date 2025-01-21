import { CodeAgent, ToolCallingAgent } from "../agents";
import { BaseTool, PythonInterpreterTool } from "../tools";

// Create a Python interpreter tool
const pythonInterpreter = new PythonInterpreterTool();

// Create a CodeAgent with the Python interpreter
const codeAgent = new CodeAgent(new Map([["python_interpreter", pythonInterpreter]]));

// Execute a code task
codeAgent.executeTask("print('Hello, World!')")
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Create a ToolCallingAgent with a dummy tool
const dummyTool = {
  execute: async (args: any) => `Executed with args: ${JSON.stringify(args)}`,
} as BaseTool;

const toolCallingAgent = new ToolCallingAgent(new Map([["dummy_tool", dummyTool]]));

// Execute a tool call
const toolCall = { toolName: "dummy_tool", arguments: { key: "value" } };
toolCallingAgent.executeTask(JSON.stringify(toolCall))
  .then(result => console.log(result))
  .catch(error => console.error(error));
