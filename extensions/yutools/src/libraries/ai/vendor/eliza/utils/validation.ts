import { Memory } from "../types/memory";

/**
 * Validates that a message contains the required fields.
 */
export function validateMessage(message: Memory): boolean {
  return (
    message.id !== undefined &&
    message.content !== undefined &&
    message.userId !== undefined &&
    message.roomId !== undefined &&
    message.createdAt !== undefined
  );
}

/**
 * Validates that an action can be performed based on the message content.
 */
export function validateAction(message: Memory, requiredField: string): boolean {
  return message.content[requiredField] !== undefined;
}