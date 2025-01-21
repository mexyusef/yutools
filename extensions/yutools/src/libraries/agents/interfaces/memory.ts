import { BaseMemory as LangChainBaseMemory } from "langchain/memory";

export interface BaseMemory {
  loadMemoryVariables(): Promise<Record<string, any>>;
  saveContext(input: Record<string, any>, output: Record<string, any>): Promise<void>;
  toLangChainMemory(): LangChainBaseMemory;
}

// export type MemoryType = "buffer" | "conversation-summary";
// export type MemoryType = "buffer" | "conversation-summary" | "vector-store" | "redis";
// C:\ai\yuagent\extensions\yutools\node_modules\langchain\dist\memory\index.d.ts
export type MemoryType =
  | "buffer"
  | "conversation-summary"
  | "buffer-window"
  // | "chat"
  | "vector-store-retriever"
  | "entity"
  | "combined"
  | "summary-buffer"
  | "token-buffer";