import { Agent } from "../types/agent";
import { EditingInstrument } from "../instruments/editing";
import { FileOperationsInstrument } from "../instruments/file-operations";
import { Instrument } from "../types";

export class EditingAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Edit") || goal.includes("Ensure")) {
        const editingInstrument = this.instruments.find(
          (instrument) => instrument.name === "editing"
        ) as EditingInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as typeof FileOperationsInstrument | undefined;

        if (editingInstrument && fileOperationsInstrument) {
          console.log(`EditingAgent (${this.id}): Working on goal - ${goal}`);
          await editingInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`EditingAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}