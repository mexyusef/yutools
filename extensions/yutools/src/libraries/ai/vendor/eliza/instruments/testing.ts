// src/instruments/testing.ts
import { Instrument } from "../types";
import { TestService } from "../services";

export class TestingInstrument implements Instrument {
  name = "testing";
  description = "Writes and runs tests for software development tasks";
  private testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Write")) {
      const testCode = await this.testService.writeTests(task);
      console.log(`Generated tests for: ${task}`);
      console.log(testCode);
    } else if (task.includes("Run")) {
      const testResults = await this.testService.runTests(task);
      console.log(`Test results for: ${task}`);
      console.log(testResults);
    }
  }
}