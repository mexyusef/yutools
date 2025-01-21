// src/utils/errorHandling.ts

export class AgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentError";
  }
}

export class AgentParsingError extends AgentError {
  constructor(message: string) {
    super(message);
    this.name = "AgentParsingError";
  }
}

export class AgentExecutionError extends AgentError {
  constructor(message: string) {
    super(message);
    this.name = "AgentExecutionError";
  }
}