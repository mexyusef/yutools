import { ToolRegistry } from ".";

export class GroqVisionClientToolUse {
  private apiKey: string;
  private baseUrl: string = "https://api.groq.com/openai/v1/chat/completions";
  private toolRegistry: ToolRegistry;

  constructor(apiKey: string, toolRegistry: ToolRegistry) {
    this.apiKey = apiKey;
    this.toolRegistry = toolRegistry;
  }

  async analyzeImageWithTool(image: { type: "url" | "base64"; data: string }, prompt: string): Promise<any> {
    const request = {
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
              },
            },
          ],
        },
      ],
      tools: this.toolRegistry.getToolDefinitions(), // Include all registered tools
      tool_choice: "auto", // Let the API decide which tool to call
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Process tool calls
    const toolCalls = data.choices[0].message.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const results = [];
      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        const tool = this.toolRegistry.getTool(toolName);

        if (tool) {
          const result = await tool.handler(toolArgs); // Execute the tool
          results.push(result);
        }
      }
      return results;
    }

    throw new Error("No tool call found in the response.");
  }
}