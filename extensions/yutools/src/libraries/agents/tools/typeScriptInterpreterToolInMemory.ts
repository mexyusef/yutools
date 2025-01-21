import * as ts from 'typescript';
import { BaseTool } from "./baseTool";
import { runInThisContext } from 'vm';

export class TypeScriptInterpreterTool extends BaseTool {
  /**
   * Execute TypeScript code by transpiling it to JavaScript and running it.
   *
   * @param args - The arguments containing the code to execute.
   * @returns The result of the code execution.
   */
  public async execute(args: { code: string }): Promise<any> {
    try {
      // Transpile TypeScript to JavaScript
      const transpiledCode = ts.transpileModule(args.code, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText;

      // Execute the transpiled JavaScript code
      const result = runInThisContext(transpiledCode);
      return result;
    } catch (error: any) {
      throw new Error(`TypeScript execution error: ${error.message}`);
    }
  }
}

// import { CodeAgent } from "../agents";
// import { TypeScriptInterpreterTool } from "../tools";

// // Create a TypeScript interpreter tool
// const typescriptInterpreter = new TypeScriptInterpreterTool();

// // Create a CodeAgent with the TypeScript interpreter
// const codeAgent = new CodeAgent(new Map([["typescript_interpreter", typescriptInterpreter]]));

// // Execute a TypeScript task
// codeAgent.executeTask("const message: string = 'Hello, TypeScript!'; console.log(message);")
//   .then(result => console.log(result))  // Output: Hello, TypeScript!
//   .catch(error => console.error(error));