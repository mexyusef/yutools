// src/instruments/code-generation.ts
import { Instrument } from "../types";
import { CodeService } from "../services";

export class CodeGenerationInstrument implements Instrument {
  name = "code-generation";
  description = "Generates code for software development tasks"; // Add description
  private codeService: CodeService;

  constructor(codeService: CodeService) {
    this.codeService = codeService;
  }

  async handler(task: string): Promise<void> {
    try {
      const code = await this.codeService.generateCode(task);
      console.log(`Generated code for: ${task}`);
      console.log(code);
    } catch (error) {
      console.error(`CodeGenerationInstrument: Error generating code for - ${task}`, error);
      throw error; // Re-throw the error for the agent to handle
    }
  }
}

// import { CodeGenerationInstrument } from "./instruments/code-generation";
// import { CodeService } from "./services/code-service";

// const codeService = new CodeService(process.env.OPENAI_API_KEY!);
// const codeGenerationInstrument = new CodeGenerationInstrument(codeService);

// async function main() {
//   const task = "Implement a shopping cart in React";
//   await codeGenerationInstrument.handler(task);
// }

// main();