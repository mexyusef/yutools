import Groq from "groq-sdk";

// Initialize the Groq client
const groq = new Groq();

// Define Models
const ROUTING_MODEL = "llama3-70b-8192";
const TOOL_USE_MODEL = "llama3-groq-70b-8192-tool-use-preview";
const GENERAL_MODEL = "llama3-70b-8192";

// Type Definitions
interface Tool {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, { type: string; description: string; enum?: string[] }>;
            required: string[];
        };
    };
}

interface Message {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    tool_call_id?: string;
    name?: string;
}

interface ToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}

// Tool Definitions
const tools: Tool[] = [
    {
        type: "function",
        function: {
            name: "calculate",
            description: "Evaluate a mathematical expression",
            parameters: {
                type: "object",
                properties: {
                    expression: {
                        type: "string",
                        description: "The mathematical expression to evaluate",
                    },
                },
                required: ["expression"],
            },
        },
    },
];

// Example Tool Implementations
function calculate(expression: string): string {
    try {
        const result = eval(expression); // Unsafe in production; replace with a safe parser
        return JSON.stringify({ result });
    } catch {
        return JSON.stringify({ error: "Invalid expression" });
    }
}

// Tool Execution Map
const availableFunctions: Record<string, (args: any) => string> = {
    calculate: ({ expression }: { expression: string }) => calculate(expression),
};

// Main Logic
async function routeQuery(query: string): Promise<"calculate" | "general"> {
    const routingPrompt = `
    Given the following user query, determine if any tools are needed to answer it.
    If a calculation tool is needed, respond with 'TOOL: CALCULATE'.
    If no tools are needed, respond with 'NO TOOL'.

    User query: ${query}
  `;

    const response = await groq.chat.completions.create({
        model: ROUTING_MODEL,
        messages: [{ role: "user", content: routingPrompt }],
        max_tokens: 20,
    });

    // const decision = response.choices[0].message.content.trim();
    const decision = response.choices?.[0]?.message?.content?.trim();
    if (!decision) {
        throw new Error("Failed to extract decision from response.");
    }

    return decision.includes("TOOL: CALCULATE") ? "calculate" : "general";
}

async function runWithTool(query: string): Promise<string> {
    // const messages: Message[] = [
    //     { role: "system", content: "You are a calculator assistant." },
    //     { role: "user", content: query },
    // ];
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "You are a helpful assistant.",
        },
        {
            role: "user",
            content: "What is the capital of the Netherlands?",
        },
    ];

    const response = await groq.chat.completions.create({
        model: TOOL_USE_MODEL,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: 4096,
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls as ToolCall[];

    if (toolCalls) {
        messages.push(responseMessage);

        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            const functionResponse = availableFunctions[functionName]?.(args);

            // messages.push({
            //     role: "tool",
            //     name: functionName,
            //     content: functionResponse || "",
            //     tool_call_id: toolCall.id,
            // });
            messages.push({
                role: "tool",
                content: functionResponse || "",
                tool_call_id: toolCall.id, // Include only allowed fields
            });

        }

        const finalResponse = await groq.chat.completions.create({
            model: TOOL_USE_MODEL,
            messages,
        });

        return finalResponse.choices[0].message.content as string;
    }

    return responseMessage.content as string;
}

async function runGeneral(query: string): Promise<string> {
    const response = await groq.chat.completions.create({
        model: GENERAL_MODEL,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: query },
        ],
    });

    return response.choices[0].message.content as string;
}

export async function processQuery(query: string): Promise<{ query: string; route: string; response: string }> {
    const route = await routeQuery(query);
    const response = route === "calculate" ? await runWithTool(query) : await runGeneral(query);

    return { query, route, response };
}

// Example Usage
(async () => {
    const queries = [
        "Calculate 25 * 4 + 10",
        "What is the capital of France?",
    ];

    for (const query of queries) {
        const result = await processQuery(query);
        console.log(`Query: ${result.query}`);
        console.log(`Route: ${result.route}`);
        console.log(`Response: ${result.response}`);
    }
})();
