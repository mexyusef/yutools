// src/types/agentTypes.ts

export interface AgentType {
  toRaw(): any;
  toString(): string;
}

export class AgentText implements AgentType {
  constructor(private value: string) {}

  toRaw(): string {
      return this.value;
  }

  toString(): string {
      return this.value;
  }
}

export class AgentImage implements AgentType {
  constructor(private value: Buffer) {}

  toRaw(): Buffer {
      return this.value;
  }

  toString(): string {
      return `Image(${this.value.length} bytes)`;
  }
}

export class AgentAudio implements AgentType {
  constructor(private value: Buffer, private sampleRate: number = 16000) {}

  toRaw(): Buffer {
      return this.value;
  }

  toString(): string {
      return `Audio(${this.value.length} bytes, ${this.sampleRate}Hz)`;
  }
}