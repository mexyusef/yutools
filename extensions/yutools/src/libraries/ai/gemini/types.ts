import { EventEmitter } from "events";

export type GeminiStream = EventEmitter;

export interface GeminiConfig {
    model: string;
    temperature: number;
    systemPrompt: string;
    streamMode: boolean;
}

export interface GeminiResponse {
    id: string;
    content: string;
}

export type GeminiStreamCallback = (chunk: string) => void;
