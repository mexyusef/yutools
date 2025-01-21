export class MemoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MemoryError";
  }
}

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export class EvaluatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvaluatorError";
  }
}