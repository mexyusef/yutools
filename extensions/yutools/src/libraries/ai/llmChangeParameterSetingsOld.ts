import * as vscode from 'vscode';
import { LLMSettings, SettingsManager } from './config';

function getValidModelsForProvider(provider: string): string[] | null {
  switch (provider) {
    case 'Cerebras':
      // https://inference-docs.cerebras.ai/introduction
      // https://inference-docs.cerebras.ai/api-reference/models
      return ['llama3.1-8b', 'llama-3.3-70b'];
    case 'Cohere':
      return ['command-r-plus-08-2024'];
    case 'Gemini':
      return ["gemini-1.5-flash-latest", "gemini-2.0-flash-exp"];
    case 'GLHF':
      return ['hf:mistralai/Mistral-7B-Instruct-v0.3'];
    case 'Groq':
      // https://console.groq.com/docs/models
      return ['llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'llama-3.3-70b-versatile'];
    case 'Hyperbolic':
      return ['hyperbolic/hyper-model-1.0', 'hyperbolic/hyper-model-2.0'];
    case 'OpenAI':
      return ['gpt-4o-mini'];
    case 'Sambanova':
      return ["Meta-Llama-3.1-405B-Instruct"];
    case 'Together':
      return [
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
        "Qwen/Qwen2.5-Coder-32B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "deepseek-ai/deepseek-llm-67b-chat",
      ];
    case 'X.AI':
      return ['grok-beta'];
    default:
      return null;
  }
}

async function updateModel(provider: string, settings: LLMSettings) {
  const validModels = getValidModelsForProvider(provider);
  if (!validModels) {
    vscode.window.showErrorMessage(`No valid models found for provider: ${provider}`);
    return;
  }

  const model = await vscode.window.showQuickPick(validModels, {
    placeHolder: `Select a model for ${provider}`,
  });

  if (!model) {
    return; // User canceled the model selection
  }

  settings.updateConfig({ model });
  vscode.window.showInformationMessage(`Model updated to ${model} for ${provider}`);
}

async function updateTemperature(provider: string, settings: LLMSettings) {
  const temperature = await vscode.window.showInputBox({
    prompt: `Enter a temperature for ${provider} (0.0 to 1.0)`,
    validateInput: (value) => {
      const temp = parseFloat(value);
      return isNaN(temp) || temp < 0 || temp > 1
        ? 'Temperature must be a number between 0.0 and 1.0'
        : null;
    },
  });

  if (!temperature) {
    return; // User canceled the temperature input
  }

  settings.updateConfig({ temperature: parseFloat(temperature) });
  vscode.window.showInformationMessage(`Temperature updated to ${temperature} for ${provider}`);
}

async function updateSystemPrompt(provider: string, settings: LLMSettings) {
  const prompt = await vscode.window.showInputBox({
    prompt: `Enter a new system prompt for ${provider}`,
  });

  if (!prompt) {
    return; // User canceled the prompt input
  }

  settings.updateConfig({ systemPrompt: prompt });
  vscode.window.showInformationMessage(`System prompt updated for ${provider}`);
}

export const llmChangeParameterSetingsOld = vscode.commands.registerCommand('yutools.llm.settings.changeSettings', async () => {
  const settingsManager = new SettingsManager();
  // Step 1: Select the provider
  const provider = await vscode.window.showQuickPick(settingsManager.getProviders(), {
    placeHolder: 'Select the LLM provider',
  });

  if (!provider) {
    return; // User canceled the provider selection
  }

  const settings = settingsManager.getSettings(provider);
  if (!settings) {
    vscode.window.showErrorMessage(`Settings not found for provider: ${provider}`);
    return;
  }

  // Step 2: Select the parameter to update
  const parameter = await vscode.window.showQuickPick(['Model', 'Temperature', 'System Prompt'], {
    placeHolder: `Select the parameter to change for ${provider}`,
  });

  if (!parameter) {
    return; // User canceled the parameter selection
  }

  // Handle each parameter change
  switch (parameter) {
    case 'Model':
      await updateModel(provider, settings);
      break;

    case 'Temperature':
      await updateTemperature(provider, settings);
      break;

    case 'System Prompt':
      await updateSystemPrompt(provider, settings);
      break;
  }
});
