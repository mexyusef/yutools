import * as vscode from "vscode";
import fs from 'fs';
import path from 'path';
import os from "os";
import { logger } from "@/yubantu/extension/logger";

export interface LLMConfig {
  model: string;
  temperature?: number;
  systemPrompt?: string;
  visionModel?: string;
  imageGenerationModel?: string;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export abstract class LLMSettings {

  protected config: LLMConfig;

  config_filepath = "DOESNT_EXIST_API_KEYS.json";
  providers: LLMProviderKeys | null;

  constructor(initialConfig: LLMConfig, config_filepath: string) {
    this.config = initialConfig;
    this.config_filepath = config_filepath;
    // console.log(`LLMSettings menerima config ${config_filepath}`);
    this.providers = loadKeysFromFile(this.config_filepath);
  }

  abstract validateConfig(): void;

  updateConfig(newConfig: Partial<LLMConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.validateConfig();
  }

  getConfig(): LLMConfig {
    return this.config;
  }

  getNextProvider() {
    let USE_LLM_PROVIDER_KEYS = this.providers;

    if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
      throw new Error(`USE_LLM_PROVIDER_KEYS null atau kosong => USE_LLM_PROVIDER_KEYS=${USE_LLM_PROVIDER_KEYS} utk config ${this.config_filepath}`);
    }

    USE_LLM_PROVIDER_KEYS.forEach((p) => {
      if (p.uses === undefined) {
        p.uses = 0;
      }
    });

    const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));
    const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
    const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
    selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;
    logger.log(`[${this.config_filepath}] getNextProvider => ${selectedProvider.name}`);
    return selectedProvider;
  }
}

export class AssemblyAISettings extends LLMSettings {

  validModels = [
    "default",
  ]

  validVisionModels = []
  validImageGenerationModels = []

  constructor() {
    super({
      model: "default",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "ASSEMBLYAI_API_KEYS.json");
  }

  validateConfig(): void {
    // const validModels = ["llama3.1-8b", "llama3.1-70b", "llama-3.3-70b"];
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Cerebras. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class CerebrasSettings extends LLMSettings {

  validModels = [
    "llama3.1-8b",
    "llama3.1-70b",
    "llama-3.3-70b",
  ]

  validVisionModels = []
  validImageGenerationModels = []

  constructor() {
    super({
      model: "llama-3.3-70b",
      // model: "llama-3.1-70b",
      // model: "llama-3.1-8b",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "CEREBRAS_API_KEYS.json");
  }

  validateConfig(): void {
    // const validModels = ["llama3.1-8b", "llama3.1-70b", "llama-3.3-70b"];
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Cerebras. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class CohereSettings extends LLMSettings {

  validModels = [
    "command-r-plus-08-2024",
  ]

  validVisionModels = []
  validImageGenerationModels = []

  constructor() {
    super({
      model: "command-r-plus-08-2024",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "COHERE_API_KEYS.json");
  }

  validateConfig(): void {
    if (this.config.temperature !== undefined && (this.config.temperature < 0 || this.config.temperature > 5)) {
      throw new Error("Temperature must be between 0 and 5 for Cohere.");
    }
  }
}

export class GeminiSettings extends LLMSettings {

  validModels = [
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-thinking-exp-1219",
    "gemini-exp-1206",
  ]

  validVisionModels = [
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-exp-1206",
  ]

  validImageGenerationModels = []

  constructor() {
    super(
      {
        model: "gemini-2.0-flash-exp",
        visionModel: "gemini-2.0-flash-exp",
        temperature: 0.2,
        systemPrompt: "You are an expert and helpful AI assistant.",
      },
      // C:\Users\usef\GOOGLE_GEMINI_API_KEYS.json
      "GOOGLE_GEMINI_API_KEYS.json"
    );
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Gemini. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class GLHFSettings extends LLMSettings {
  validModels = [
    // https://glhf.chat/api/openai/v1
    // https://glhf.chat/chat/create
    // Note that model names will need to be appended with "hf:". For example, hf:meta-llama/Llama-3.1-405B-Instruct.
    "hf:mistralai/Mistral-7B-Instruct-v0.3",
    "hf:mistralai/Mixtral-8x22B-Instruct-v0.1",
    "hf:meta-llama/Llama-3.1-405B-Instruct",
    "hf:meta-llama/Llama-3.3-70B-Instruct",
    "hf:Qwen/Qwen2.5-Coder-32B-Instruct",
    "hf:Qwen/Qwen2.5-72B-Instruct",
    "hf:Qwen/QwQ-32B-Preview",
    "hf:huihui-ai/Llama-3.3-70B-Instruct-abliterated",
  ]

  validVisionModels = [
    "hf:meta-llama/Llama-3.2-90B-Vision-Instruct",
  ]

  validImageGenerationModels = []

  baseURL = 'https://glhf.chat/api/openai/v1'

  constructor() {
    super(
      {
        // model: "hf:mistralai/Mistral-7B-Instruct-v0.3",
        // model: "hf:meta-llama/Llama-3.3-70B-Instruct", // oleh together
        model: "hf:Qwen/Qwen2.5-Coder-32B-Instruct",
        temperature: 0.2,
        systemPrompt: "You are an expert and helpful AI assistant.",
      },
      "GLHF_API_KEYS.json"
    );
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for GLHF. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class GroqSettings extends LLMSettings {

  // https://console.groq.com/docs/models
  validModels = [
    "llama-3.3-70b-versatile", // 128k context, 32k output
    "llama-3.1-8b-instant", // 128k context, 8k output
    "mixtral-8x7b-32768", // 32k context
    // previews
    "llama3-groq-70b-8192-tool-use-preview", //	Groq	8,192	-	-
    "llama3-groq-8b-8192-tool-use-preview", // Groq	8,192	-	-
    "llama-3.3-70b-specdec", //	Meta	8,192	-	-
    "llama-3.1-70b-specdec", //	Meta	-	8,192	-
    "llama-3.2-1b-preview", //	Meta	128k	8,192	-
    "llama-3.2-3b-preview", //	Meta	128k	8,192	-
    "llama-3.2-11b-vision-preview", //	Meta	128k	8,192	-
    "llama-3.2-90b-vision-preview", //	Meta	128k	8,192	-
  ]

  // https://console.groq.com/docs/vision
  validVisionModels = [
    "llama-3.2-90b-vision-preview",
    "llama-3.2-11b-vision-preview",
  ]

  validImageGenerationModels = []

  constructor() {
    super({
      model: "llama-3.3-70b-versatile",
      visionModel: "llama-3.2-90b-vision-preview",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "GROQ_API_KEYS.json");
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Groq. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class HuggingfaceSettings extends LLMSettings {

  // https://huggingface.co/models?pipeline_tag=image-to-video&sort=likes
  // https://huggingface.co/models?other=code
  // https://huggingface.co/models?pipeline_tag=text-generation
  // https://huggingface.co/spaces/bigcode/bigcode-models-leaderboard
  // https://huggingface.co/spaces/Akirami/code-llm-explorer
  // create fullstack app = flutter frontend and fastapi backend that record voice from frontend and send voice chunks to backend, and transcribe the voice chunks in real time
  // https://huggingface.co/spaces/bardsai/performance-llm-board

  validModels = [
    "Qwen/Qwen2.5-Coder-32B-Instruct", // https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct
    "Qwen/Qwen2.5-Coder-7B-Instruct", //https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct
    "m-a-p/OpenCodeInterpreter-DS-33B", // https://huggingface.co/m-a-p/OpenCodeInterpreter-DS-33B
    "NTQAI/Nxcode-CQ-7B-orpo", // https://huggingface.co/NTQAI/Nxcode-CQ-7B-orpo
    "mistralai/Codestral-22B-v0.1", // https://huggingface.co/mistralai/Codestral-22B-v0.1
    // https://huggingface.co/deepseek-ai/deepseek-coder-33b-instruct
    "deepseek-ai/DeepSeek-V2.5-1210", // https://huggingface.co/deepseek-ai/DeepSeek-V2.5-1210
    "deepseek-coder-33b-instruct",
    // https://huggingface.co/deepseek-ai/DeepSeek-V2
    // https://huggingface.co/deepseek-ai/DeepSeek-V2.5-1210
    // https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Base
    // https://huggingface.co/deepseek-ai/deepseek-llm-67b-base
    // https://huggingface.co/deepseek-ai/DeepSeek-V2-Chat-0628
    // https://huggingface.co/deepseek-ai/DeepSeek-V3
    // https://huggingface.co/deepseek-ai/DeepSeek-V3-Base

    // https://lmarena.ai/?leaderboard
    "Nexusflow/Athene-V2-Chat", // https://huggingface.co/Nexusflow/Athene-V2-Chat
    // https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/
    "MaziyarPanahi/calme-3.2-instruct-78b", // https://huggingface.co/MaziyarPanahi/calme-3.2-instruct-78b
    "dfurman/CalmeRys-78B-Orpo-v0.1", // https://huggingface.co/dfurman/CalmeRys-78B-Orpo-v0.1
  ]

  // https://huggingface.co/models?other=vision
  // https://huggingface.co/spaces/opencompass/open_vlm_leaderboard
  validVisionModels = [
    "OpenGVLab/InternVL2_5-78B", // https://huggingface.co/OpenGVLab/InternVL2_5-78B
    "Qwen/Qwen2-VL-72B-Instruct", // https://huggingface.co/Qwen/Qwen2-VL-72B-Instruct
    "OpenGVLab/InternVL2_5-38B", // https://huggingface.co/OpenGVLab/InternVL2_5-38B
    // https://huggingface.co/OpenGVLab/InternVL2_5-26B
    // https://huggingface.co/01-ai/Yi-VL-34B
  ]

  // https://huggingface.co/models?pipeline_tag=text-to-image&sort=trending
  validImageGenerationModels = [
    "stabilityai/stable-diffusion-2",
    "black-forest-labs/FLUX.1-dev", // https://huggingface.co/black-forest-labs/FLUX.1-dev
  ];

  constructor() {
    super({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      // model: "deepseek-coder-33b-instruct",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
      imageGenerationModel: "stabilityai/stable-diffusion-2",
    }, "HUGGINGFACE_API_KEYS.json");
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Huggingface. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class HyperbolicSettings extends LLMSettings {

  // https://app.hyperbolic.xyz/models
  validModels = [
    "meta-llama/Llama-3.3-70B-Instruct", // https://app.hyperbolic.xyz/models/llama-3-3-70b-instruct/api
    "Qwen/Qwen2.5-Coder-32B-Instruct", // https://app.hyperbolic.xyz/models/qwen2-5-coder-32b-instruct/api
    "Qwen/Qwen2.5-72B-Instruct", // https://app.hyperbolic.xyz/models/qwen2-5-72b-instruct/api
    "Qwen/QwQ-32B-Preview", // https://app.hyperbolic.xyz/models/qwq-32b-preview/api
    "deepseek-ai/DeepSeek-V2.5", // https://app.hyperbolic.xyz/models/deepseek-v2-5/api
    "meta-llama/Meta-Llama-3.1-405B-Instruct", // https://app.hyperbolic.xyz/models/llama31-405b/api
    "meta-llama/Meta-Llama-3.1-405B", // https://app.hyperbolic.xyz/models/llama31-405b-base-bf-16/api
    "deepseek-ai/DeepSeek-V3", // https://x.com/zjasper666/status/1872657228676895185/photo/1
  ]

  validVisionModels = []

  validImageGenerationModels = []

  baseURL = 'https://api.hyperbolic.xyz/v1'

  constructor() {
    super({
      // model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      // model: "deepseek-ai/DeepSeek-V2.5",
      model: "deepseek-ai/DeepSeek-V3",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "HYPERBOLIC_API_KEYS.json");
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Hyperbolic. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class OpenAISettings extends LLMSettings {

  validModels = [
    "gpt-4o-mini",
    "gpt-4",
    "gpt-4o",
    "gpt-3.5-turbo",
  ]

  validVisionModels = []
  validImageGenerationModels = []

  constructor() {
    super({
      model: "gpt-4o-mini",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "OPENAI_API_KEYS.json");
  }

  validateConfig(): void {
    if (this.config.temperature !== undefined && (this.config.temperature < 0 || this.config.temperature > 1)) {
      throw new Error("Temperature must be between 0 and 1 for OpenAI.");
    }
  }
}

export class SambanovaSettings extends LLMSettings {
  validModels = [
    "Meta-Llama-3.1-405B-Instruct",
  ]

  validVisionModels = []
  validImageGenerationModels = []

  baseURL = 'https://api.sambanova.ai/v1'

  constructor() {
    super({
      model: "Meta-Llama-3.1-405B-Instruct",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "SAMBANOVA_API_KEYS.json");
  }

  validateConfig(): void {
    // const validModels = ["Meta-Llama-3.1-405B-Instruct"];
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Sambanova. Valid models: " + this.validModels.join(", "));
    }
  }
}

export class TogetherSettings extends LLMSettings {

  // https://api.together.xyz/models
  validModels = [
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "Qwen/Qwen2.5-72B-Instruct-Turbo",
    "deepseek-ai/deepseek-llm-67b-chat",
  ]

  // C:\ai\yuagent\extensions\yutools\src\libraries\ai\together\vision_library.ts
  validVisionModels = [
    "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
    "meta-llama/Llama-Vision-Free",
  ]

  // https://api.together.xyz/models
  validImageGenerationModels = [
    "black-forest-labs/FLUX.1-dev",
    "black-forest-labs/FLUX.1-canny",
    "black-forest-labs/FLUX.1-depth",
    "black-forest-labs/FLUX.1-redux",
    "black-forest-labs/FLUX.1-schnell",
    "black-forest-labs/FLUX.1.1-pro",
    "black-forest-labs/FLUX.1-schnell-Free",
  ]

  // https://api.together.xyz/models
  validEmbeddingModels = [
    "togethercomputer/m2-bert-80M-32k-retrieval",
    "togethercomputer/m2-bert-80M-8k-retrieval",
    "togethercomputer/m2-bert-80M-2k-retrieval",
    "WhereIsAI/UAE-Large-V1",
    "BAAI/bge-large-en-v1.5",
    "BAAI/bge-base-en-v1.5",
  ]

  shortNames = {
    "lama-33": this.validModels[0],
    "lama-31-405": this.validModels[1],
    "qwen-32-coder": this.validModels[2],
    "qwen-72": this.validModels[3],
    "deepseek": this.validModels[4],
  }

  baseURL = 'https://api.together.xyz/v1'

  constructor() {
    super(
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        // visionModel: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
        visionModel: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
        // imageGenerationModel: "black-forest-labs/FLUX.1-schnell-Free",
        // imageGenerationModel: "black-forest-labs/FLUX.1-depth",
        imageGenerationModel: "black-forest-labs/FLUX.1-schnell",
        temperature: 0.2,
        systemPrompt: "You are an expert and helpful AI assistant.",
      },
      "TOGETHER_API_KEYS.json"
    );
  }

  validateConfig(): void {
    // if (!this.config.model.startsWith("meta-llama") && !this.config.model.startsWith("Qwen")) {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for Together AI. Valid models: " + this.validModels.join(", "));
    }
  }

  public validateModel(model: string): string {
    if (!this.validVisionModels.includes(model)) {
      throw new Error(`Invalid model: ${model}. Supported models are: ${this.validVisionModels.join(", ")}`);
    }
    return model;
  }

}

export class XAISettings extends LLMSettings {

  // https://docs.x.ai/docs/overview
  validModels = [
    "grok-beta",
    "grok-2-1212",
  ]

  // https://docs.x.ai/docs/guides/image-understanding
  validVisionModels = [
    "grok-vision",
    "grok-2-vision-1212",
  ]

  validImageGenerationModels = []

  baseURL = 'https://api.x.ai/v1'

  constructor() {
    super({
      model: "grok-2-1212",
      visionModel: "grok-2-vision-1212",
      temperature: 0.2,
      systemPrompt: "You are an expert and helpful AI assistant.",
    }, "XAI_API_KEYS.json");
  }

  validateConfig(): void {
    if (!this.validModels.includes(this.config.model)) {
      throw new Error("Invalid model for XAI. Valid models: " + this.validModels.join(", "));
    }
  }
}

export const assemblyaiSettings = new AssemblyAISettings();
export const cerebrasSettings = new CerebrasSettings();
export const cohereSettings = new CohereSettings();
export const geminiSettings = new GeminiSettings();
export const glhfSettings = new GLHFSettings();
export const groqSettings = new GroqSettings();
export const huggingfaceSettings = new HuggingfaceSettings();
export const hyperbolicSettings = new HyperbolicSettings();
export const openaiSettings = new OpenAISettings();
export const sambanovaSettings = new SambanovaSettings();
export const togetherSettings = new TogetherSettings();
export const xaiSettings = new XAISettings();

export class SettingsManager {
  private settingsMap: Map<string, LLMSettings>;

  constructor() {
    this.settingsMap = new Map<string, LLMSettings>();
    this.initializeSettings();
  }

  initializeSettings() {
    this.settingsMap.set('AssemblyAI', assemblyaiSettings);
    this.settingsMap.set('Cerebras', cerebrasSettings);
    this.settingsMap.set('Cohere', cohereSettings);
    this.settingsMap.set('Gemini', geminiSettings);
    this.settingsMap.set('GLHF', glhfSettings);
    this.settingsMap.set('Groq', groqSettings);
    this.settingsMap.set('Huggingface', huggingfaceSettings);
    this.settingsMap.set('Hyperbolic', hyperbolicSettings);
    this.settingsMap.set('OpenAI', openaiSettings);
    this.settingsMap.set('Sambanova', sambanovaSettings);
    this.settingsMap.set('Together', togetherSettings);
    this.settingsMap.set('X.AI', xaiSettings);
  }

  getProviders(): string[] {
    return Array.from(this.settingsMap.keys());
  }

  getSettings(provider: string): LLMSettings | undefined {
    return this.settingsMap.get(provider);
  }
}

const CONFIG_FILE_PATH = path.join(os.homedir(), "XAI_API_KEYS.json");

export interface LLMProviderKey {
  name: string; // Required
  key: string;  // Required
  settings?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  baseUrl?: string;
  model?: string;
  uses?: number;
}

type LLMProviderKeys = LLMProviderKey[];

type LLMProviderKeyOrNull = LLMProviderKey | null;

type LLMProviderKeysOrNull = LLMProviderKeys | null;

export type LLMMessage = { role: "system" | "user" | "assistant"; content: string };

export type LLMMessageArray = LLMMessage[];

const USAGE_FILE_PATH = path.join(os.homedir(), 'keyUsage.json');

const LLM_PROVIDER_KEYS: LLMProviderKeys = [
  {
    settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
    baseUrl: "https://api.x.ai/v1",
    model: "grok-beta",
    uses: 0,
    name: "key01",
    key: "xai-1",
  },
];

export function loadKeysFromSettings(configName: string)
  : LLMProviderKeysOrNull {
  try {
    const config = vscode.workspace.getConfiguration();
    const keys = config.get(configName);
    if (keys && Array.isArray(keys)) {
      return keys as typeof LLM_PROVIDER_KEYS;
    }
  } catch (err) {
    console.error("Error reading keys from settings:", err);
  }
  return null;
}

export function saveKeysToSettings(configName: string, keys: typeof LLM_PROVIDER_KEYS): void {
  try {
    const config = vscode.workspace.getConfiguration();
    config.update(configName, keys, vscode.ConfigurationTarget.Global);
  } catch (err) {
    console.error("Error saving keys to settings:", err);
  }
}

export function loadUsageData() {
  if (fs.existsSync(USAGE_FILE_PATH)) {
    return JSON.parse(fs.readFileSync(USAGE_FILE_PATH, 'utf-8'));
  }
  return {};
}

export function saveUsageData(usageData: Record<string, number>) {
  fs.writeFileSync(USAGE_FILE_PATH, JSON.stringify(usageData, null, 2));
}

export function loadKeysFromFile(configFile?: string): LLMProviderKeys | null {
  // console.log(`loadKeysFromFile #1: ${configFile}`);
  if (configFile === undefined) {
    configFile = CONFIG_FILE_PATH;
  } else {
    // Check if the configFile is absolute; if not, prefix it with os.homedir()
    if (!path.isAbsolute(configFile)) {
      // /mnt/c/Users/usef/*.json
      configFile = path.join(os.homedir(), configFile);
    }
  }
  try {
    if (fs.existsSync(configFile)) {
      const fileContent = fs.readFileSync(configFile, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error("Error reading keys from file:", err);
  }
  // console.log(`loadKeysFromFile #9: ${configFile} = NULL`);
  return null;
}
