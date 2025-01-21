import { BaseTool } from "./baseTool";
// import { exec } from 'child_process';
import { PythonShell } from 'python-shell';
// import type { Options as PythonShellOptions } from 'python-shell';

export class PythonInterpreterTool extends BaseTool {
  /**
   * Execute Python code.
   *
   * @param args - The arguments containing the code to execute.
   * @returns The result of the code execution.
   */
  public async execute(args: { code: string }): Promise<any> {
    // Placeholder logic: Simulate code execution
    console.log(`Executing Python code: ${args.code}`);
    // return "Code executed successfully.";
    // return new Promise((resolve, reject) => {
    //   exec(`python -c "${args.code}"`, (error, stdout, stderr) => {
    //     if (error) {
    //       reject(new Error(`Python execution error: ${stderr}`));
    //     } else {
    //       resolve(stdout.trim());
    //     }
    //   });
    // });
    console.log(`Executing Python code: ${args.code}`);

    try {
      // Use PythonShell.runString with the Promise-based API
      const results = await PythonShell.runString(args.code, undefined);
      return results.join('\n'); // Join the output lines into a single string
    } catch (err: any) {
      throw new Error(`Python execution error: ${err.message}`);
    }
    // return new Promise((resolve, reject) => {
    //   PythonShell.runString(code: string, options?: PythonShellOptions): Promise<string[]>;

    //   // PythonShell.runString(args.code, null, (err, results) => {
    //   //   if (err) {
    //   //     reject(new Error(`Python execution error: ${err.message}`));
    //   //   } else {
    //   //     resolve(results.join('\n'));
    //   //   }
    //   // });

    // });


  }
}

// import { CodeAgent } from "../agents";
// import { PythonInterpreterTool } from "../tools";

// // Create a Python interpreter tool
// const pythonInterpreter = new PythonInterpreterTool();

// // Create a CodeAgent with the Python interpreter
// const codeAgent = new CodeAgent(new Map([["python_interpreter", pythonInterpreter]]));

// // Execute a Python code task
// codeAgent.executeTask("print('Hello, Python!')")
//   .then(result => console.log(result))  // Output: Hello, Python!
//   .catch(error => console.error(error));