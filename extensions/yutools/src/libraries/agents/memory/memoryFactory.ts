import { BufferMemory, BufferMemoryInput } from "langchain/memory";
import { ConversationSummaryMemory, ConversationSummaryMemoryInput } from "langchain/memory";
import { BufferWindowMemory, BufferWindowMemoryInput } from "langchain/memory";
// import { BaseChatMemory, BaseChatMemoryInput } from "langchain/memory";
import { VectorStoreRetrieverMemory, VectorStoreRetrieverMemoryParams } from "langchain/memory";
import { EntityMemory } from "langchain/memory";
import { CombinedMemory, CombinedMemoryInput } from "langchain/memory";
import { ConversationSummaryBufferMemory, ConversationSummaryBufferMemoryInput } from "langchain/memory";
import { ConversationTokenBufferMemory, ConversationTokenBufferMemoryInput } from "langchain/memory";
import { BaseMemory, MemoryType } from "../interfaces/memory";
import { LangChainMemory } from "./langchainMemory";

export class MemoryFactory {
  static createMemory(type: MemoryType, options: any): BaseMemory {
    switch (type) {
      case "buffer":
        return new LangChainMemory(new BufferMemory(options as BufferMemoryInput));
      case "conversation-summary":
        return new LangChainMemory(new ConversationSummaryMemory(options as ConversationSummaryMemoryInput));
      case "buffer-window":
        return new LangChainMemory(new BufferWindowMemory(options as BufferWindowMemoryInput));
      // case "chat":
      //   return new LangChainMemory(new BaseChatMemory(options as BaseChatMemoryInput));
      case "vector-store-retriever":
        return new LangChainMemory(new VectorStoreRetrieverMemory(options as VectorStoreRetrieverMemoryParams));
      case "entity":
        return new LangChainMemory(new EntityMemory(options));
      case "combined":
        return new LangChainMemory(new CombinedMemory(options as CombinedMemoryInput));
      case "summary-buffer":
        return new LangChainMemory(new ConversationSummaryBufferMemory(options as ConversationSummaryBufferMemoryInput));
      case "token-buffer":
        return new LangChainMemory(new ConversationTokenBufferMemory(options as ConversationTokenBufferMemoryInput));
      default:
        throw new Error(`Unsupported memory type: ${type}`);
    }
  }
}