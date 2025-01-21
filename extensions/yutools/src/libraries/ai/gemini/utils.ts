export function formatPrompt(prompt: string): string {
  return prompt.trim();
}

export function validateTemperature(temperature: number): boolean {
  return temperature >= 0 && temperature <= 1;
}
