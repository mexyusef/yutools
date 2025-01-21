import { Agent } from "../types/agent";
import { DesignInstrument } from "../instruments/design";
import { FileOperationsInstrument } from "../instruments/file-operations";
import { Instrument } from "../types";

export class DesignAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Design") || goal.includes("Format")) {
        const designInstrument = this.instruments.find(
          (instrument) => instrument.name === "design"
        ) as DesignInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as typeof FileOperationsInstrument | undefined;

        if (designInstrument && fileOperationsInstrument) {
          console.log(`DesignAgent (${this.id}): Working on goal - ${goal}`);
          await designInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`DesignAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}