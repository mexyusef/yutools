import { ToolRegistry } from ".";

const toolRegistry = new ToolRegistry();

// Tool 1: Get dog facts
toolRegistry.registerTool({
  name: "get_dog_facts",
  description: "Gets facts about a given dog breed",
  parameters: {
    type: "object",
    properties: {
      breed_name: {
        type: "string",
        description: "The name of the dog breed",
      },
    },
    required: ["breed_name"],
  },
  handler: async (args: { breed_name: string }) => {
    const apiUrl = `https://api.api-ninjas.com/v1/dogs?name=${args.breed_name}`;
    const response = await fetch(apiUrl, {
      headers: { "X-Api-Key": "your-api-ninjas-key" },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch dog facts: ${response.statusText}`);
    }
    const data = await response.json();
    return data[0];
  },
});

// Tool 2: Get weather
toolRegistry.registerTool({
  name: "get_weather",
  description: "Gets the current weather for a given location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g., San Francisco, CA",
      },
    },
    required: ["location"],
  },
  handler: async (args: { location: string }) => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=your-weather-api-key&q=${args.location}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  },
});