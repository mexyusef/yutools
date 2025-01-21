import { Agent, Instrument } from "../../types";
import { BudgetingInstrument } from "./BudgetingInstrument";

export class FinanceAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Budget") || goal.includes("Track")) {
        const budgetingInstrument = this.instruments.find(
          (instrument) => instrument.name === "budgeting"
        ) as BudgetingInstrument | undefined;

        if (budgetingInstrument) {
          console.log(`FinanceAgent (${this.id}): Working on goal - ${goal}`);
          await budgetingInstrument.handler(goal);
        } else {
          console.error(`FinanceAgent (${this.id}): No budgeting instrument found`);
        }
      }
    }
  }
}