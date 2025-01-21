export type ApiProvider =
	| "anthropic"
	| "openrouter"
	| "bedrock"
	| "vertex"
	| "openai"
	| "ollama"
	| "lmstudio"
	| "gemini"
	| "x.ai"
	| "sambanova"
	| "hyperbolic"
	| "groq"
	| "openai-native";

export interface ApiHandlerOptions {
	apiModelId?: string
	apiKey?: string // anthropic
	anthropicBaseUrl?: string
	openRouterApiKey?: string
	openRouterModelId?: string
	openRouterModelInfo?: ModelInfo
	awsAccessKey?: string
	awsSecretKey?: string
	awsSessionToken?: string
	awsRegion?: string
	awsUseCrossRegionInference?: boolean
	vertexProjectId?: string
	vertexRegion?: string
	openAiBaseUrl?: string
	openAiApiKey?: string
	openAiModelId?: string
	ollamaModelId?: string
	ollamaBaseUrl?: string
	lmStudioModelId?: string
	lmStudioBaseUrl?: string
	geminiApiKey?: string
	openAiNativeApiKey?: string
	azureApiVersion?: string
}

export type ApiConfiguration = ApiHandlerOptions & {
	apiProvider?: ApiProvider
};

// Models
export interface ModelInfo {
	maxTokens?: number
	contextWindow?: number
	supportsImages?: boolean
	supportsComputerUse?: boolean
	supportsPromptCache: boolean // this value is hardcoded for now
	inputPrice?: number
	outputPrice?: number
	cacheWritesPrice?: number
	cacheReadsPrice?: number
	description?: string
}

// Anthropic
// https://docs.anthropic.com/en/docs/about-claude/models
export type AnthropicModelId = keyof typeof anthropicModels;
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20241022";
export const anthropicModels = {
	"claude-3-5-sonnet-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: true,
		inputPrice: 3.0, // $3 per million input tokens
		outputPrice: 15.0, // $15 per million output tokens
		cacheWritesPrice: 3.75, // $3.75 per million tokens
		cacheReadsPrice: 0.3, // $0.30 per million tokens
	},
	"claude-3-5-haiku-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: true,
		inputPrice: 1.0,
		outputPrice: 5.0,
		cacheWritesPrice: 1.25,
		cacheReadsPrice: 0.1,
	},
	"claude-3-opus-20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 15.0,
		outputPrice: 75.0,
		cacheWritesPrice: 18.75,
		cacheReadsPrice: 1.5,
	},
	"claude-3-haiku-20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 0.25,
		outputPrice: 1.25,
		cacheWritesPrice: 0.3,
		cacheReadsPrice: 0.03,
	},
} as const satisfies Record<string, ModelInfo>; // as const assertion makes the object deeply readonly

// AWS Bedrock
// https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
export type BedrockModelId = keyof typeof bedrockModels;
export const bedrockDefaultModelId: BedrockModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0";
export const bedrockModels = {
	"anthropic.claude-3-5-sonnet-20241022-v2:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-5-haiku-20241022-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 1.0,
		outputPrice: 5.0,
	},
	"anthropic.claude-3-5-sonnet-20240620-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-opus-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15.0,
		outputPrice: 75.0,
	},
	"anthropic.claude-3-sonnet-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-haiku-20240307-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
} as const satisfies Record<string, ModelInfo>;

// OpenRouter
// https://openrouter.ai/models?order=newest&supported_parameters=tools
export const openRouterDefaultModelId = "anthropic/claude-3.5-sonnet:beta"; // will always exist in openRouterModels
export const openRouterDefaultModelInfo: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 200_000,
	supportsImages: true,
	supportsComputerUse: true,
	supportsPromptCache: true,
	inputPrice: 3.0,
	outputPrice: 15.0,
	cacheWritesPrice: 3.75,
	cacheReadsPrice: 0.3,
	description:
		"The new Claude 3.5 Sonnet delivers better-than-Opus capabilities, faster-than-Sonnet speeds, at the same Sonnet prices. Sonnet is particularly good at:\n\n- Coding: New Sonnet scores ~49% on SWE-Bench Verified, higher than the last best score, and without any fancy prompt scaffolding\n- Data science: Augments human data science expertise; navigates unstructured data while using multiple tools for insights\n- Visual processing: excelling at interpreting charts, graphs, and images, accurately transcribing text to derive insights beyond just the text alone\n- Agentic tasks: exceptional tool use, making it great at agentic tasks (i.e. complex, multi-step problem solving tasks that require engaging with other systems)\n\n#multimodal\n\n_This is a faster endpoint, made available in collaboration with Anthropic, that is self-moderated: response moderation happens on the provider's side instead of OpenRouter's. For requests that pass moderation, it's identical to the [Standard](/anthropic/claude-3.5-sonnet) variant._",
};

// Vertex AI
// https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
export type VertexModelId = keyof typeof vertexModels;
export const vertexDefaultModelId: VertexModelId = "claude-3-5-sonnet-v2@20241022";
export const vertexModels = {
	"claude-3-5-sonnet-v2@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"claude-3-5-sonnet@20240620": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"claude-3-5-haiku@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 1.0,
		outputPrice: 5.0,
	},
	"claude-3-opus@20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15.0,
		outputPrice: 75.0,
	},
	"claude-3-haiku@20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
} as const satisfies Record<string, ModelInfo>;

export const openAiModelInfoSaneDefaults: ModelInfo = {
	maxTokens: -1,
	contextWindow: 128_000,
	supportsImages: true,
	supportsPromptCache: false,
	inputPrice: 0,
	outputPrice: 0,
};

// Gemini
// https://ai.google.dev/gemini-api/docs/models/gemini
export type GeminiModelId = keyof typeof geminiModels;
export const geminiDefaultModelId: GeminiModelId = "gemini-1.5-flash-002";
export const geminiModels = {
	"gemini-1.5-flash-002": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-flash-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-flash-8b-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-pro-002": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-pro-exp-0827": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
} as const satisfies Record<string, ModelInfo>;

// OpenAI Native
// https://openai.com/api/pricing/
export type OpenAiNativeModelId = keyof typeof openAiNativeModels;
export const openAiNativeDefaultModelId: OpenAiNativeModelId = "gpt-4o";
export const openAiNativeModels = {
	// don't support tool use yet
	"o1-preview": {
		maxTokens: 32_768,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15,
		outputPrice: 60,
	},
	"o1-mini": {
		maxTokens: 65_536,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3,
		outputPrice: 12,
	},
	"gpt-4o": {
		maxTokens: 4_096,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 5,
		outputPrice: 15,
	},
	"gpt-4o-mini": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.15,
		outputPrice: 0.6,
	},
} as const satisfies Record<string, ModelInfo>;

// Azure OpenAI
// https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
// https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#api-specs
export const azureOpenAiDefaultApiVersion = "2024-08-01-preview";

/////////////////////////////// tambahan 1
// Define provider-specific model IDs
export type XAIModelId = keyof typeof xaiModels;
// Default model IDs for each provider
export const xaiDefaultModelId: XAIModelId = "grok-beta";
// Consolidate models into a unified export
// https://console.x.ai/team/4295b6bf-d1fc-4a14-88c7-0a8c50b18e11/models?cluster=us-east-1
export const xaiModels = {
	"grok-beta": {
		maxTokens: 8192,
		contextWindow: 131072,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 5.0,
		outputPrice: 15.0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "X.AI Grok beta model for text completion.",
	},
	"grok-vision-beta": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: true,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 5.0,
		outputPrice: 15.0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "X.AI Grok beta model for image.",
	},
} as const satisfies Record<string, ModelInfo>;


/////////////////////////////// tambahan 2
export type HyperbolicModelId = keyof typeof hyperbolicModels;
export type SambaNovaModelId = keyof typeof sambaNovaModels;
export const hyperbolicDefaultModelId: HyperbolicModelId = "Qwen/Qwen2.5-Coder-32B-Instruct";
export const sambaNovaDefaultModelId: SambaNovaModelId = "Meta-Llama-3.1-70B-Instruct";
export type GroqModelId = keyof typeof groqModels;
// export const groqDefaultModelId: GroqModelId = "llama3-groq-8b-8192-tool-use-preview";
export const groqDefaultModelId: GroqModelId = "llama3-groq-70b-8192-tool-use-preview";
// https://console.groq.com/docs/models
// Model ID | Developer | Context Window (tokens) | Max Tokens | Max File Size | Model Card Link
// ------------------------------------------------------------------------------------------------
// gemma2-9b-it							Google	8,192	-	-	Card
// gemma-7b-it								Google	8,192	-	-	Card
// llama3-groq-70b-8192-tool-use-preview	Groq	8,192	-	-	Card
// llama3-groq-8b-8192-tool-use-preview	Groq	8,192	-	-	Card

// llama-3.1-70b-versatile					Meta	128k	8k	-	Card
// llama-3.1-8b-instant					Meta	128k	8k	-	Card
// llama-3.2-1b-preview					Meta	128k	8k	-	Card
// llama-3.2-3b-preview					Meta	128k	8k	-	Card
// llama-3.2-11b-vision-preview			Meta	128k	8k	-	Card
// llama-3.2-90b-vision-preview			Meta	128k	8k	-	Card

// llama-guard-3-8b						Meta	8,192	-	-	Card
// llama3-70b-8192							Meta	8,192	-	-	Card
// llama3-8b-8192							Meta	8,192	-	-	Card
// mixtral-8x7b-32768						Mistral	32,768	-	-	Card

export const hyperbolicModels = {
	"Qwen/Qwen2.5-Coder-32B-Instruct": {
		maxTokens: 512,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Hyperbolic Qwen2.5 Coder 32B Instruct model.",
	},
	"deepseek-ai/DeepSeek-V2.5": {
		maxTokens: 512,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Hyperbolic DeepSeek V2.5 model.",
	},
} as const satisfies Record<string, ModelInfo>;


// https://community.sambanova.ai/t/supported-models/193
// export const sambaNovaModels = {
// 	"Meta-Llama-3.1-8B-Instruct": {
// 		maxTokens: 8192,
// 		contextWindow: 2048,
// 		supportsImages: false,
// 		supportsComputerUse: false,
// 		supportsPromptCache: false,
// 		inputPrice: 0,
// 		outputPrice: 0,
// 		cacheWritesPrice: 0,
// 		cacheReadsPrice: 0,
// 		description: "SambaNova Meta-Llama 3.1 8B Instruct model.",
// 	},
// 	"Meta-Llama-3.1-70B-Instruct": {
// 		maxTokens: 8192,
// 		contextWindow: 2048,
// 		supportsImages: false,
// 		supportsComputerUse: false,
// 		supportsPromptCache: false,
// 		inputPrice: 0,
// 		outputPrice: 0,
// 		cacheWritesPrice: 0,
// 		cacheReadsPrice: 0,
// 		description: "SambaNova Meta-Llama 3.1 70B Instruct model.",
// 	},
// } as const satisfies Record<string, ModelInfo>;

export const sambaNovaModels = {
	"Meta-Llama-3.1-8B-Instruct": {
		maxTokens: 8192,
		contextWindow: 2048,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "SambaNova Meta-Llama 3.1 8B Instruct model.",
	},
	"Meta-Llama-3.1-70B-Instruct": {
		maxTokens: 8192,
		contextWindow: 2048,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "SambaNova Meta-Llama 3.1 70B Instruct model.",
	},
	"Meta-Llama-3.1-405B-Instruct": {
		maxTokens: 8192,
		contextWindow: 8000,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "SambaNova Meta-Llama 3.1 405B Instruct model.",
	},
	"Meta-Llama-3.2-1B-Instruct": {
		maxTokens: 4096,
		contextWindow: 4096,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Meta Llama 3.2 1B Instruct model.",
	},
	"Meta-Llama-3.2-3B-Instruct": {
		maxTokens: 4096,
		contextWindow: 4096,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Meta Llama 3.2 3B Instruct model.",
	},
	"Llama-3.2-11B-Vision-Instruct": {
		maxTokens: 4096,
		contextWindow: 4096,
		supportsImages: true,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Meta Llama 3.2 11B Vision Instruct model.",
	},
	"Llama-3.2-90B-Vision-Instruct": {
		maxTokens: 4096,
		contextWindow: 4096,
		supportsImages: true,
		supportsComputerUse: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		cacheWritesPrice: 0,
		cacheReadsPrice: 0,
		description: "Meta Llama 3.2 90B Vision Instruct model.",
	},
} as const satisfies Record<string, ModelInfo>;


export const groqModels = {
	"gemma2-9b-it": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		description: "Google Gemma2 9B model with 8192 token context window.",
	},
	"gemma-7b-it": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Google Gemma 7B model with 8192 token context window.",
	},
	"llama3-groq-70b-8192-tool-use-preview": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Groq's Llama3 70B model optimized for tool-use with 8192 token context window.",
	},
	"llama3-groq-8b-8192-tool-use-preview": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Groq's Llama3 8B model optimized for tool-use with 8192 token context window.",
	},
	"llama-3.1-70b-versatile": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Meta's Llama 3.1 70B versatile model with 128k token context window.",
	},
	"llama-3.1-8b-instant": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: false,
		supportsPromptCache: false,
		supportsComputerUse: false,
		description: "Meta's Llama 3.1 8B instant model with 128k token context window.",
	},
	"llama-3.2-1b-preview": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Meta's Llama 3.2 1B preview model with 128k token context window.",
	},
	"llama-3.2-3b-preview": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Meta's Llama 3.2 3B preview model with 128k token context window.",
	},
	"llama-3.2-11b-vision-preview": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "Meta's Llama 3.2 11B vision preview model with 128k token context window, supports image processing.",
	},
	"llama-3.2-90b-vision-preview": {
		maxTokens: 8192,
		contextWindow: 128000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "Meta's Llama 3.2 90B vision preview model with 128k token context window, supports image processing.",
	},
	"llama-guard-3-8b": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Meta's Llama Guard 3 8B model with 8192 token context window.",
	},
	"llama3-70b-8192": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		supportsComputerUse: false,
		description: "Meta's Llama 3 70B model with 8192 token context window.",
	},
	"llama3-8b-8192": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsComputerUse: false,
		supportsPromptCache: false,
		description: "Meta's Llama 3 8B model with 8192 token context window.",
	},
	"mixtral-8x7b-32768": {
		maxTokens: 32768,
		contextWindow: 32768,
		supportsImages: false,
		supportsPromptCache: false,
		supportsComputerUse: false,
		description: "Mistral Mixtral 8x7B model with 32k token context window.",
	},
} as const satisfies Record<string, ModelInfo>;
