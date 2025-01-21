import { InstrumentManager } from "./instrument-manager";
import { StorageBackend } from "../backends";
import { PerformerConfig, Memory, State } from "../types";

export class Performer {
  id: string; // Add id property
  constructor(
    private config: PerformerConfig,
    private instrumentManager: InstrumentManager,
    private storageBackend: StorageBackend
  ) {
    this.id = config.id; // Initialize id from config
  }

  async processMessage(message: Memory): Promise<void> {
    const state = await this.composeState(message);
    await this.instrumentManager.evaluateMessage(message, state);
    await this.instrumentManager.processActions(message, state);
  }

  private async composeState(message: Memory): Promise<State> {
    const recentMessages = await this.storageBackend.getRecentMessages(message.roomId);
    return {
      performerId: this.config.id,
      recentMessages,
      goals: this.config.goals || [],
      storageBackend: this.storageBackend, // Include storageBackend in the returned State object
    };
  }
}