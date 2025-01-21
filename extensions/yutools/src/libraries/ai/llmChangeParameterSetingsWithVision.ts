import * as vscode from 'vscode';
import { SettingsManager } from "./config";

export const llmChangeParameterSetingsWithVision = vscode.commands.registerCommand('yutools.llm.settings.changeSettings3', async () => {
  // Step 1: Initialize the SettingsManager and fetch providers
  const settingsManager = new SettingsManager();
  const providers = settingsManager.getProviders();

  const provider = await vscode.window.showQuickPick(providers, {
    placeHolder: 'Select the LLM provider',
  });

  if (!provider) {
    return; // User canceled
  }

  // Step 2: Get settings for the selected provider
  const settings = settingsManager.getSettings(provider);
  if (!settings) {
    vscode.window.showErrorMessage(`Settings not found for provider: ${provider}`);
    return;
  }

  const config = settings.getConfig();

  // Step 3: Select the parameter to update
  const parameterOptions = ['Model', 'Temperature', 'System Prompt'];
  
  // Add 'Vision Model' and 'Image Generation Model' if they have valid models
  if ((settings as any).validVisionModels?.length > 0) {
    parameterOptions.push('Vision Model');
  }
  if ((settings as any).validImageGenerationModels?.length > 0) {
    parameterOptions.push('Image Generation Model');
  }

  const parameter = await vscode.window.showQuickPick(parameterOptions, {
    placeHolder: `Select the parameter to change for ${provider}`,
  });

  if (!parameter) {
    return; // User canceled
  }

  // Step 4: Handle updates for each parameter
  switch (parameter) {
    case 'Model': {
      const validModels = (settings as any).validModels ?? [];
      if (!Array.isArray(validModels) || validModels.length === 0) {
        vscode.window.showErrorMessage(`No valid models available for ${provider}`);
        return;
      }

      const currentModel = config.model;
      const model = await vscode.window.showQuickPick(
        [currentModel, ...validModels.filter((m: string) => m !== currentModel)],
        {
          placeHolder: `Current model: ${currentModel}`,
        }
      );
      if (model) {
        settings.updateConfig({ model });
        vscode.window.showInformationMessage(`Updated model for ${provider} to ${model}`);
      }
      break;
    }
    case 'Temperature': {
      const currentTemperature = config.temperature ?? 0.5;
      const newTemperature = await vscode.window.showInputBox({
        prompt: `Enter a new temperature (Current: ${currentTemperature})`,
        validateInput: (value) => {
          const num = parseFloat(value);
          return isNaN(num) || num < 0 || num > 1
            ? 'Temperature must be a number between 0 and 1'
            : null;
        },
      });
      if (newTemperature !== undefined) {
        settings.updateConfig({ temperature: parseFloat(newTemperature) });
        vscode.window.showInformationMessage(`Updated temperature for ${provider} to ${newTemperature}`);
      }
      break;
    }
    case 'System Prompt': {
      const currentPrompt = config.systemPrompt ?? 'No system prompt set.';
      const newPrompt = await vscode.window.showInputBox({
        prompt: `Enter a new system prompt (Current: "${currentPrompt}")`,
      });
      if (newPrompt !== undefined) {
        settings.updateConfig({ systemPrompt: newPrompt });
        vscode.window.showInformationMessage(`Updated system prompt for ${provider} to "${newPrompt}"`);
      }
      break;
    }
    case 'Vision Model': {
      const validVisionModels = (settings as any).validVisionModels ?? [];
      if (!Array.isArray(validVisionModels) || validVisionModels.length === 0) {
        vscode.window.showErrorMessage(`No valid vision models available for ${provider}`);
        return;
      }

      const currentVisionModel = config.visionModel;
      const visionModel = await vscode.window.showQuickPick(
        [currentVisionModel, ...validVisionModels.filter((m: string) => m !== currentVisionModel)],
        {
          placeHolder: `Current vision model: ${currentVisionModel}`,
        }
      );
      if (visionModel) {
        settings.updateConfig({ visionModel });
        vscode.window.showInformationMessage(`Updated vision model for ${provider} to ${visionModel}`);
      }
      break;
    }
    case 'Image Generation Model': {
      const validImageGenerationModels = (settings as any).validImageGenerationModels ?? [];
      if (!Array.isArray(validImageGenerationModels) || validImageGenerationModels.length === 0) {
        vscode.window.showErrorMessage(`No valid image generation models available for ${provider}`);
        return;
      }

      const currentImageGenerationModel = config.imageGenerationModel;
      const imageGenerationModel = await vscode.window.showQuickPick(
        [currentImageGenerationModel, ...validImageGenerationModels.filter((m: string) => m !== currentImageGenerationModel)],
        {
          placeHolder: `Current image generation model: ${currentImageGenerationModel}`,
        }
      );
      if (imageGenerationModel) {
        settings.updateConfig({ imageGenerationModel });
        vscode.window.showInformationMessage(`Updated image generation model for ${provider} to ${imageGenerationModel}`);
      }
      break;
    }
  }
});