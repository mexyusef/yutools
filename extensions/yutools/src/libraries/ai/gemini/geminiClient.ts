import { EventEmitter } from "events";
import { GeminiConfig, GeminiResponse, GeminiStreamCallback } from "./types";
import { DEFAULT_MODEL, DEFAULT_STREAM_MODE, DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from "./constants";
import axios from "axios";

export class GeminiClient {
    private model: string;
    private temperature: number;
    private systemPrompt: string;
    private streamMode: boolean;

    constructor(config: Partial<GeminiConfig> = {}) {
        this.model = config.model || DEFAULT_MODEL;
        this.temperature = config.temperature || DEFAULT_TEMPERATURE;
        this.systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
        this.streamMode = config.streamMode || DEFAULT_STREAM_MODE;
    }

    setModel(model: string) {
        this.model = model;
    }

    setTemperature(temperature: number) {
        this.temperature = temperature;
    }

    setSystemPrompt(prompt: string) {
        this.systemPrompt = prompt;
    }

    setStreamMode(streamMode: boolean) {
        this.streamMode = streamMode;
    }

    async sendPrompt(prompt: string): Promise<GeminiResponse | EventEmitter> {
        if (this.streamMode) {
            return this.streamPrompt(prompt);
        } else {
            return this.nonStreamPrompt(prompt);
        }
    }

    // private async nonStreamPrompt(prompt: string): Promise<GeminiResponse> {
    //     return {
    //         id: "response-id",
    //         content: `Response for prompt: ${prompt}`,
    //     };
    // }

    // private async streamPrompt(prompt: string): Promise<EventEmitter> {
    //     const emitter = new EventEmitter();
    
    //     const simulateStream = async (callback: (chunk: string) => void) => {
    //         const chunks = ["Response part 1", "Response part 2", "Response part 3"];
    //         for (const chunk of chunks) {
    //             await new Promise((resolve) => setTimeout(resolve, 500));
    //             callback(chunk);
    //         }
    //         emitter.emit("end");
    //     };
    //     simulateStream((chunk) => emitter.emit("data", chunk));    
    //     return emitter;
    // }
    private async nonStreamPrompt(prompt: string): Promise<GeminiResponse> {
        try {
            const response = await axios.post("https://api.gemini.com/v1/completions", {
                model: this.model,
                prompt: prompt,
                temperature: this.temperature,
                system_prompt: this.systemPrompt,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Failed to fetch non-streaming response");
        }
    }

    private async streamPrompt(prompt: string): Promise<EventEmitter> {
        const emitter = new EventEmitter();
        const source = axios.CancelToken.source();

        try {
            const response = await axios.post(
                "https://api.gemini.com/v1/completions/stream",
                {
                    model: this.model,
                    prompt: prompt,
                    temperature: this.temperature,
                    system_prompt: this.systemPrompt,
                },
                {
                    responseType: "stream",
                    cancelToken: source.token,
                }
            );

            response.data.on("data", (chunk: Buffer) => {
                const decodedChunk = chunk.toString("utf-8");
                emitter.emit("data", decodedChunk);
            });

            response.data.on("end", () => {
                emitter.emit("end");
            });
        } catch (error: any) {
            emitter.emit("error", error.response?.data?.error || "Stream request failed");
        }

        return emitter;
    }
}
