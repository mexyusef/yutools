export interface ApiResponse {
    response: string;
}

export interface MultiQueriesResponse {
    response: string[];
}

export interface ConfigInvokeAll {
    [key: string]: number;
}

export interface ActiveConfig {
    active: string;
    options: string[];
}

export interface SecondaryActiveConfig {
    secondary_active: string;
    options: string[];
}

export interface ModeConfig {
    mode: string;
    options: string[];
}

export interface CompletionResponse {
    suggestions: string[];
}

export interface Cache {
    [key: string]: string[];
}

export type PostItem = {
    title: string;
    author: string;
    date: string;
    url: string;
};
