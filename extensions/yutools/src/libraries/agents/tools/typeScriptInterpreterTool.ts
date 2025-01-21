import { exec } from 'child_process';
import { BaseTool } from "./baseTool";

export class TypeScriptInterpreterTool extends BaseTool {
  /**
   * Execute TypeScript code using Deno.
   *
   * @param args - The arguments containing the code to execute.
   * @returns The result of the code execution.
   */
  public async execute(args: { code: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      // Use Deno to execute the TypeScript code
      // exec(`deno eval "${args.code}"`, (error, stdout, stderr) => {
      exec(`ts-node -e "${args.code}"`, (error, stdout, stderr) => {

        if (error) {
          reject(new Error(`TypeScript execution error: ${stderr}`));
        } else {
          resolve(stdout.trim());
        }
      });

    });

  }
}

// import { CodeAgent } from "../agents";
// import { TypeScriptInterpreterTool } from "../tools";

// // Create a TypeScript interpreter tool
// const typescriptInterpreter = new TypeScriptInterpreterTool();

// // Create a CodeAgent with the TypeScript interpreter
// const codeAgent = new CodeAgent(new Map([["typescript_interpreter", typescriptInterpreter]]));

// // Execute a TypeScript task
// codeAgent.executeTask("console.log('Hello, TypeScript!');")
//   .then(result => console.log(result))  // Output: Hello, TypeScript!
//   .catch(error => console.error(error));
