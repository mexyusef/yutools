import { Orchestra, PostgresBackend } from "orchestra";
import { imageGenerationInstrument } from "./instruments/image-generation";

// Initialize the orchestra
const dbBackend = new PostgresBackend(process.env.DATABASE_URL!);
const orchestra = new Orchestra({
  storageBackend: dbBackend,
  instruments: [imageGenerationInstrument],
  performers: [
    {
      id: "performer-1",
      goals: ["Assist users with tasks"],
    },
  ],
});

// Process a message
const message = {
  id: "msg-123",
  content: { text: "Generate an image of a sunset" },
  userId: "user-123",
  roomId: "room-456",
  createdAt: new Date(),
};

orchestra.processMessage("performer-1", message);