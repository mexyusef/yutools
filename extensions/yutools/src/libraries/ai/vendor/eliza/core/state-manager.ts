import { Memory, State } from "../types";

export class StateManager {
  private state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  async updateState(message: Memory): Promise<State> {
    this.state.recentMessages = [...this.state.recentMessages, message];
    return this.state;
  }

  async getState(): Promise<State> {
    return this.state;
  }
}