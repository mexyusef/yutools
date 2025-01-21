import { Memory } from "./memory";
import { State } from "./state";

export interface Evaluator {
  name: string; // Name of the evaluator (e.g., "EVALUATE_FACTS")
  similes: string[]; // Alternative names or aliases for the evaluator
  alwaysRun?: boolean; // Whether the evaluator should always run
  validate: (message: Memory, state: State) => Promise<boolean>; // Validate if the evaluator should run
  handler: (message: Memory, state: State) => Promise<void>; // Logic to execute the evaluator
}