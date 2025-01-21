import { GLHFLLMClientSingleton } from '@/libraries/ai/glhf/glhf';

// Used to generate a summary of older messages.
export async function summarizeMessages(messages: { role: 'system' | 'user' | 'assistant', content: string }[]): Promise<string> {
  const llmClient = GLHFLLMClientSingleton.getInstance();

  // Create a prompt for summarization
  const prompt = `Summarize the following conversation in a concise manner:\n\n${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

  try {
    // Query the LLM to generate a summary
    const summary = await llmClient.createCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes conversations.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
    }) as string;

    return summary.trim();
  } catch (error: any) {
    console.error('Error during summarization:', error);
    throw error;
  }
}