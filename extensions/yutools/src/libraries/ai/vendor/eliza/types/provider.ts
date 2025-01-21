export interface Provider {
  name: string; // Name of the provider (e.g., "OpenAI")
  apiKey: string; // API key or credentials for the provider
  endpoint?: string; // Endpoint URL for the provider (if applicable)
  [key: string]: any; // Additional configuration options
}