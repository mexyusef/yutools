/**
 * Validates that a message contains the required fields for an action.
 */
export function validateActionMessage(message: any, requiredFields: string[]): boolean {
  return requiredFields.every((field) => message.content?.[field] !== undefined);
}

/**
 * Logs an action with a timestamp.
 */
export function logAction(action: string, performerId: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Action: ${action} (Performer: ${performerId})`);
}