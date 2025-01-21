export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface FileData {
  fileUri: string;
  mimeType: string;
}

export interface GenerativeContent {
  prompt: string;
  parts: Array<GenerativePart | FileData>;
}

export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface FileData {
  fileUri: string;
  mimeType: string;
}

export interface GenerativeContent {
  prompt: string;
  parts: Array<GenerativePart | FileData>;
}
