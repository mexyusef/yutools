import { GLHFLLMClient } from "@/libraries/ai/glhf/glhf";
import { getClient } from "../clientManager";
import { readPromptFromFile } from "@/libraries/prompts/collections/readPromptFromFile";
import { glhfSettings } from "@/libraries/ai/config";
import { click, type } from "../..";

const promptFilePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections\\prompt.web-quick2.md';
const bolt_text_area_placeholder = "How can Bolt help you today?";

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

  // Type the prompt into the textarea
  await type(client, `textarea[placeholder="${bolt_text_area_placeholder}"]`, prompt);
  console.log(`Typed the prompt: "${prompt}"`);

  // <div class="relative select-none">
  //   <textarea class="w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm" placeholder="How can Bolt help you today?" translate="no" style="min-height: 76px; max-height: 200px; height: 76px; overflow-y: hidden;"></textarea>
  //   <button class="absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-accent-500 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme disabled:cursor-not-allowed" style="opacity: 1; transform: none;">
  //     <div class="text-lg">
  //       <div class="i-ph:arrow-right"></div>
  //     </div>
  //   </button>
  // </div>
  // Click the button with the right arrow to send the prompt
  await click(client, '.relative > button'); // Selects the button inside the same parent div as the textarea
  console.log(`Clicked the send button.`);
}