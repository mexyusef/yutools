import { BaseMemory } from "../interfaces/memory";
import { BaseMemory as LangChainBaseMemory } from "langchain/memory";

export class LangChainMemory implements BaseMemory {
  private memory: LangChainBaseMemory;

  constructor(memory: LangChainBaseMemory) {
    this.memory = memory;
  }

  async loadMemoryVariables(): Promise<Record<string, any>> {
    try {
      return await this.memory.loadMemoryVariables({});
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to load memory variables: ${error.message}`);
      }
      throw new Error("Failed to load memory variables due to an unknown error.");
    }
  }

  async saveContext(input: Record<string, any>, output: Record<string, any>): Promise<void> {
    try {
      await this.memory.saveContext(input, output);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to save memory context: ${error.message}`);
      }
      throw new Error("Failed to save memory context due to an unknown error.");
    }
  }

  toLangChainMemory(): LangChainBaseMemory {
    return this.memory;
  }

}


// import { BufferMemory, BufferMemoryInput } from "langchain/memory";
// import { BaseMemory } from "../interfaces/memory";

// export class LangChainMemory implements BaseMemory {
//   private memory: BufferMemory;

//   constructor(options: BufferMemoryInput = {}) {
//     this.memory = new BufferMemory(options);
//   }

//   async loadMemoryVariables(): Promise<Record<string, any>> {
//     try {
//       return await this.memory.loadMemoryVariables({});
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to load memory variables: ${error.message}`);
//       }
//       throw new Error("Failed to load memory variables due to an unknown error.");
//     }
//   }

//   async saveContext(input: Record<string, any>, output: Record<string, any>): Promise<void> {
//     try {
//       await this.memory.saveContext(input, output);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to save memory context: ${error.message}`);
//       }
//       throw new Error("Failed to save memory context due to an unknown error.");
//     }
//   }
// }

// import { BufferMemory, BufferMemoryInput } from "langchain/memory";

// export class LangChainMemory {
//   private memory: BufferMemory;

//   constructor(options: BufferMemoryInput = {}) {
//     this.memory = new BufferMemory(options);
//   }

//   async loadMemoryVariables(): Promise<Record<string, any>> {
//     try {
//       return await this.memory.loadMemoryVariables({});
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to load memory variables: ${error.message}`);
//       }
//       throw new Error("Failed to load memory variables due to an unknown error.");
//     }
//   }

//   async saveContext(input: Record<string, any>, output: Record<string, any>): Promise<void> {
//     try {
//       await this.memory.saveContext(input, output);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to save memory context: ${error.message}`);
//       }
//       throw new Error("Failed to save memory context due to an unknown error.");
//     }
//   }
// }