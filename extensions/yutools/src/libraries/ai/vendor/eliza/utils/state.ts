import { Memory, State } from "../types";
import { StorageBackend } from "../backends"; // Import StorageBackend

/**
 * Composes the state for a performer based on recent messages and goals.
 */
export function composeState(
  performerId: string,
  recentMessages: Memory[],
  goals: string[],
  storageBackend: StorageBackend // Add storageBackend as a parameter
): State {
  return {
    performerId,
    recentMessages,
    goals,
    storageBackend, // Include storageBackend in the returned State object
  };
}

/**
 * Updates the state with a new message.
 */
export function updateState(state: State, message: Memory): State {
  return {
    ...state,
    recentMessages: [...state.recentMessages, message],
  };
}

// import { composeState } from "../utils/state";
// import { InMemoryBackend } from "../backends/in-memory";
// import { Memory } from "../types";

// const storageBackend = new InMemoryBackend();
// const recentMessages: Memory[] = [];
// const goals = ["Assist users with tasks"];

// const state = composeState("performer-1", recentMessages, goals, storageBackend);