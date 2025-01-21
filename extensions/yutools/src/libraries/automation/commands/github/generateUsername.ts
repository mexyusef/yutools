import { glhfSettings } from "@/libraries/ai/config";
import { GLHFLLMClient, GLHFLLMClientSingleton } from "@/libraries/ai/glhf/glhf";

// harus gunakan nama...via llm
export function generateUsernameMarkedAsSpam(email: string): string {
  // Remove everything after '@' and non-alphanumeric characters
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
}

// const llm = new GLHFLLMClient();
// let llmResponse: string = '';
// try {
//   llmResponse = await llm.createCompletion({
//     messages: [
//       { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
//       { role: 'user', content: filePrompt },
//     ],
//   }) as string;
// } catch (error: any) {
//   vscode.window.showErrorMessage(`Failed to query LLM: ${error}`);
//   return;
// }
// const prompt = llmResponse.trim();

export async function generateUsername(nationality: string = "India", gender: string = "male"): Promise<string> {
  const llm = GLHFLLMClientSingleton.getInstance();
  const userPrompt = `
    Generate a unique username that meets the following criteria:
    1. Contains only letters (no numbers or special characters except for the year).
    2. Includes a random 4-digit year from 1980 onwards appended at the end.
    3. Is unique and sufficiently long to ensure uniqueness.
    4. Reflects the nationality: ${nationality} and gender: ${gender}.
    
    Example: "JohnDoe1985" or "PriyaSharma1990".
    
    Provide only the username as the output.
  `;

  let llmResponse: string = '';
  try {
    llmResponse = await llm.createCompletion({
      messages: [
        { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
        { role: 'user', content: userPrompt },
      ],
    }) as string;
  } catch (error: any) {
    console.log(`Failed to query LLM: ${error}`);
    throw new Error("Failed to generate username");
  }

  // Process the LLM response to extract the username
  const username = llmResponse.trim();
  return username;
}

// (async () => {
//   try {
//     const username = await generateUsername();
//     console.log("Generated Username:", username);
//   } catch (error) {
//     console.error(error);
//   }
// })();