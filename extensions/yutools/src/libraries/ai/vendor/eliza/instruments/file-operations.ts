import { Instrument, Action } from "../types";
import { StorageBackend } from "../backends"; // Import StorageBackend
import fs from "fs";
import path from "path";

export const FileOperationsInstrument: Instrument = {
  name: "file-operations",
  description: "Performs local file operations",
  actions: [
    {
      name: "READ_FILE",
      similes: ["OPEN_FILE", "LOAD_FILE"],
      description: "Read the contents of a file",
      validate: async (message, state) => {
        return message.content?.filePath !== undefined;
      },
      handler: async (message, state) => {
        const { storageBackend } = state; // Access storageBackend from state
        const { filePath } = message.content;
        const content = fs.readFileSync(filePath, "utf-8");
        await storageBackend.createMemory({
          id: crypto.randomUUID(),
          content: { text: `File content: ${content}` },
          userId: message.userId,
          roomId: message.roomId,
          createdAt: new Date(),
        });
      },
    },
    {
      name: "WRITE_FILE",
      similes: ["SAVE_FILE", "CREATE_FILE"],
      description: "Write content to a file",
      validate: async (message, state) => {
        return (
          message.content?.filePath !== undefined &&
          message.content?.content !== undefined
        );
      },
      handler: async (message, state) => {
        const { storageBackend } = state; // Access storageBackend from state
        const { filePath, content } = message.content;
        fs.writeFileSync(filePath, content);
        await storageBackend.createMemory({
          id: crypto.randomUUID(),
          content: { text: `File written: ${filePath}` },
          userId: message.userId,
          roomId: message.roomId,
          createdAt: new Date(),
        });
      },
    },
  ],

  handler: async (task: string): Promise<void> => {
    if (task.includes("Save") || task.includes("Read")) {
      const filePath = path.join(__dirname, "output.txt");
      fs.writeFileSync(filePath, "Sample content");
      console.log(`File saved to: ${filePath}`);
    }
  },

};

// export class FileOperationsInstrumentor implements Instrument {
//   name = "file-operations";
//   description = "Handles file operations like saving and reading files";

//   async handler(task: string): Promise<void> {
//     if (task.includes("Save") || task.includes("Read")) {
//       const filePath = path.join(__dirname, "output.txt");
//       fs.writeFileSync(filePath, "Sample content");
//       console.log(`File saved to: ${filePath}`);
//     }
//   }
// }