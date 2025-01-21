// src/interfaces/gradioUI.ts

import { BaseAgent } from "../agents/baseAgent";

export class GradioUI {
  private agent: BaseAgent;

  constructor(agent: BaseAgent) {
    this.agent = agent;
  }

  /**
   * Launch the Gradio UI for interacting with the agent.
   */
  public launch(): void {
    console.log("Gradio UI launched. Placeholder for now.");
  }

  /**
   * Interact with the agent via the UI.
   *
   * @param prompt - The user's input prompt.
   * @returns The agent's response.
   */
  public async interact(prompt: string): Promise<string> {
    const response = await this.agent.executeTask(prompt);
    return response;
  }
}