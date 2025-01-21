import { Instrument, Action, Evaluator } from "../types";

export class InstrumentManager {
  private instruments: Instrument[] = [];

  constructor(instruments: Instrument[]) {
    this.instruments = instruments;
  }

  async evaluateMessage(message: any, state: any): Promise<void> {
    for (const instrument of this.instruments) {
      for (const evaluator of instrument.evaluators || []) {
        if (await evaluator.validate(message, state)) {
          await evaluator.handler(message, state);
        }
      }
    }
  }

  async processActions(message: any, state: any): Promise<void> {
    for (const instrument of this.instruments) {
      for (const action of instrument.actions || []) {
        if (await action.validate(message, state)) {
          await action.handler(message, state);
        }
      }
    }
  }
}