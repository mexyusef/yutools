import { Action } from "./action";
import { Evaluator } from "./evaluator";

export interface Instrument {
  name: string; // Name of the instrument (e.g., "image-generation")
  description: string; // Description of the instrument
  actions?: Action[]; // Actions supported by the instrument
  evaluators?: Evaluator[]; // Evaluators associated with the instrument
  handler: (task: string) => Promise<void>;
}