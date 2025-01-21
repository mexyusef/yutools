import { Instrument, Action } from "../types";
import { StorageBackend } from "../backends"; // Import StorageBackend

export const imageGenerationInstrument: Instrument = {
  name: "image-generation",
  description: "Generates images from text prompts",
  actions: [
    {
      name: "GENERATE_IMAGE",
      similes: ["CREATE_IMAGE", "MAKE_PICTURE"],
      description: "Generate an AI image from text",
      validate: async (message, state) => true, // Updated to match Action interface
      handler: async (message, state) => {
        const { storageBackend } = state; // Access storageBackend from state
        const imageUrl = await generateImage({ prompt: message.content.text });
        await storageBackend.createMemory({
          id: crypto.randomUUID(),
          content: { text: `Generated image: ${imageUrl}` },
          userId: message.userId,
          roomId: message.roomId,
          createdAt: new Date(),
        });
      },
    },
  ],
};

// Placeholder for image generation logic
async function generateImage(options: { prompt: string }): Promise<string> {
  // Replace with actual image generation logic (e.g., using DALL-E or Stable Diffusion)
  return "https://example.com/generated-image.png";
}