import { Instrument } from "../../types";
import { FinanceService } from "./FinanceService";

export class BudgetingInstrument implements Instrument {
  name = "budgeting";
  description = "Manages budgeting and financial planning";
  private financeService: FinanceService;

  constructor(financeService: FinanceService) {
    this.financeService = financeService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Budget") || task.includes("Track")) {
      const plan = "Create a budget for Q4";
      const budget = await this.financeService.createBudget(plan);
      console.log(`Generated budget: ${budget}`);
    }
  }
}