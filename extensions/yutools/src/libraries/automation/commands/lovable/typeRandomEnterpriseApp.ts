import { GLHFLLMClient } from "@/libraries/ai/glhf/glhf";
import { getClient } from "../clientManager";
import { clickCreateButton } from "./clickCreateButton";
import { typeIntoChatInput } from "./typeIntoChatInput";
import { readPromptFromFile } from "@/libraries/prompts/collections/readPromptFromFile";
import { glhfSettings } from "@/libraries/ai/config";

const promptFilePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections\\prompt.web-quick2.md';

export async function typeRandomEnterpriseApp() {
  const client = getClient();
  const llm = new GLHFLLMClient();
  const filePrompt = await readPromptFromFile(promptFilePath);
  const llmResponse = await llm.createCompletion({
    messages: [
      { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
      { role: 'user', content: filePrompt },
    ],
  }) as string;
  const prompt = llmResponse.trim();

  // Type text into the chat input
  await typeIntoChatInput(client, prompt);

  // Click the "Create" button
  await clickCreateButton(client);
}