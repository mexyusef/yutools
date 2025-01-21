import { window } from "vscode";
import { CacheManager } from "./cacheManager";
import { GenerativeAI } from "./generativeAI";

const cacheManager = new CacheManager();
const genAI = new GenerativeAI();

export async function createCache() {
  const filePath = await window.showInputBox({
    prompt: "Enter the file path for caching:",
    placeHolder: "/path/to/file.txt",
  });

  if (!filePath) {
    window.showErrorMessage("File path is required.");
    return;
  }

  const mimeType = await window.showInputBox({
    prompt: "Enter the MIME type of the file:",
    placeHolder: "text/plain",
  });

  if (!mimeType) {
    window.showErrorMessage("MIME type is required.");
    return;
  }

  const cacheResult = await cacheManager.createCache("models/gemini-1.5-flash-001", filePath, mimeType);
  window.showInformationMessage(`Cache created: ${cacheResult.name}`);
}

export async function getCache() {
  const cacheName = await window.showInputBox({
    prompt: "Enter the cache name:",
    placeHolder: "cache-name",
  });

  if (!cacheName) {
    window.showErrorMessage("Cache name is required.");
    return;
  }

  const cacheResult = await cacheManager.getCache(cacheName);
  window.showInformationMessage(`Cache retrieved: ${JSON.stringify(cacheResult)}`);
}

export async function deleteCache() {
  const cacheName = await window.showInputBox({
    prompt: "Enter the cache name to delete:",
    placeHolder: "cache-name",
  });

  if (!cacheName) {
    window.showErrorMessage("Cache name is required.");
    return;
  }

  await cacheManager.deleteCache(cacheName);
  window.showInformationMessage(`Cache deleted: ${cacheName}`);
}