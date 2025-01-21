import { encodeImage } from '../utils';
import { OpenAILLMClientSingleton } from '../../openai/OpenAILLMClientSingleton';
// import { OpenAI } from 'openai';
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = OpenAILLMClientSingleton.getInstance().getClient();

export async function visionPromptWithOpenAI(prompt: string, imagePath?: string): Promise<string> {
  const messages: any[] = [{ role: "user", content: [{ type: "text", text: prompt }] }];
  if (imagePath) {
    const base64Image = encodeImage(imagePath);
    messages[0].content.push({ type: "image_url", image_url: `data:image/jpeg;base64,${base64Image}` });
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages,
    max_tokens: 300
  });
  return response.choices[0].message.content || '';
}