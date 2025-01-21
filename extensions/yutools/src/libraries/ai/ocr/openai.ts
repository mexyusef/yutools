import { encodeImage } from './utils';
import { OpenAILLMClientSingleton } from '../openai/OpenAILLMClientSingleton';
// import { OpenAI } from 'openai';
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = OpenAILLMClientSingleton.getInstance().getClient();

export async function ocrByOpenAI(imagePath: string, userPrompt: string): Promise<string> {
  const base64Image = encodeImage(imagePath);

  // Construct the payload with proper typing
  const payload = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user" as const, // Ensure the role is explicitly typed as "user"
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: `data:image/jpeg;base64,${base64Image}` } as any // Use type assertion for image_url
        ]
      }
    ],
    max_tokens: 300
  };

  const response = await openai.chat.completions.create(payload);
  return response.choices[0].message.content || '';
}