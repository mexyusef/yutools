import { PersistentMemoryWithFiles } from "../PersistentMemoryWithFiles";

// const memory = new PersistentMemoryWithFiles('path/to/database.sqlite', 'conversation_1', 'Project Discussion');
const memory = new PersistentMemoryWithFiles('path/to/database.sqlite');

async function main() {
  // Upload a text file
  await memory.uploadFile('path/to/file.txt', 'file.txt', 'text');

  // Upload a PDF file
  await memory.uploadFile('path/to/file.pdf', 'file.pdf', 'pdf');

  // Upload an image file
  await memory.uploadFile('path/to/image.png', 'image.png', 'image');

  // Retrieve all files for the conversation
  const files = memory.getFiles();
  console.log('Files:', files);
}