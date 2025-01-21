/**
 * Logs a message with a timestamp.
 */
export function logMessage(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Logs an action with a timestamp.
 */
export function logAction(action: string, performerId: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Action: ${action} (Performer: ${performerId})`);
}