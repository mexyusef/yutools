import { Orchestra, PostgresBackend, SQLiteBackend, InMemoryBackend } from "orchestra";
import { imageGenerationInstrument, blockchainInstrument, webSearchInstrument } from "./instruments";

// Initialize the orchestra with a backend
const dbBackend = new PostgresBackend(process.env.DATABASE_URL!); // or SQLiteBackend, InMemoryBackend
const orchestra = new Orchestra({
  storageBackend: dbBackend,
  instruments: [imageGenerationInstrument, blockchainInstrument, webSearchInstrument],
  performers: [
    {
      id: "performer-1",
      goals: ["Assist users with tasks"],
    },
  ],
});

// Process a message for image generation
const imageMessage = {
  id: "msg-123",
  content: { text: "Generate an image of a sunset" },
  userId: "user-123",
  roomId: "room-456",
  createdAt: new Date(),
};
orchestra.processMessage("performer-1", imageMessage);

// Process a message for blockchain interaction
const blockchainMessage = {
  id: "msg-456",
  content: { transaction: { to: "0xRecipientAddress", value: ethers.utils.parseEther("1.0") } },
  userId: "user-123",
  roomId: "room-456",
  createdAt: new Date(),
};
orchestra.processMessage("performer-1", blockchainMessage);

// Process a message for web search
const webSearchMessage = {
  id: "msg-789",
  content: { query: "latest AI trends" },
  userId: "user-123",
  roomId: "room-456",
  createdAt: new Date(),
};
orchestra.processMessage("performer-1", webSearchMessage);