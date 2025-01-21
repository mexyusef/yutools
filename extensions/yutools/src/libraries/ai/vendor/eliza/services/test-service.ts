// src/services/test-service.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class TestService {
  async writeTests(task: string): Promise<string> {
    // Placeholder for test generation logic
    return `// Generated tests for: ${task}`;
  }

  async runTests(task: string): Promise<string> {
    try {
      // Run Jest tests
      const { stdout, stderr } = await execAsync("npx jest");
      if (stderr) {
        throw new Error(stderr);
      }
      return stdout;
    } catch (error) {
      console.error("TestService: Error running tests", error);
      throw error;
    }
  }
}