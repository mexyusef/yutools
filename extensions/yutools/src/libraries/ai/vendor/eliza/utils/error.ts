import { MemoryError, ActionError, EvaluatorError } from "../types";

/**
 * Logs an error and returns a standardized error response.
 */
export function handleError(error: unknown): { success: boolean; message: string } {
  if (error instanceof MemoryError || error instanceof ActionError || error instanceof EvaluatorError) {
    console.error(`Error: ${error.name} - ${error.message}`);
    return { success: false, message: error.message };
  } else if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
    return { success: false, message: "An unexpected error occurred" };
  } else {
    console.error("An unknown error occurred");
    return { success: false, message: "An unknown error occurred" };
  }
}