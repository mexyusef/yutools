import { Memory } from "./memory";
import { State } from "./state";

export interface Action {
  name: string; // Name of the action (e.g., "GENERATE_IMAGE")
  similes: string[]; // Alternative names or aliases for the action
  description: string; // Description of the action
  validate: (message: Memory, state: State) => Promise<boolean>; // Validate if the action can be performed
  handler: (message: Memory, state: State) => Promise<void>; // Logic to execute the action
}