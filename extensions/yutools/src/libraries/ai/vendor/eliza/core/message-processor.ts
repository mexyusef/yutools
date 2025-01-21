import { Memory, State, Action, Evaluator } from "../types";

export class MessageProcessor {
  private actions: Action[];
  private evaluators: Evaluator[];

  constructor(actions: Action[], evaluators: Evaluator[]) {
    this.actions = actions;
    this.evaluators = evaluators;
  }

  async processMessage(message: Memory, state: State): Promise<void> {
    // Evaluate the message
    for (const evaluator of this.evaluators) {
      if (await evaluator.validate(message, state)) {
        await evaluator.handler(message, state);
      }
    }

    // Process actions
    for (const action of this.actions) {
      if (await action.validate(message, state)) {
        await action.handler(message, state);
      }
    }
  }
}