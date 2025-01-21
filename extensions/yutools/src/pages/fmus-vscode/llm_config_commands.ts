import * as vscode from 'vscode';
import axios from 'axios';
import { API_BASE_URL, extension_name } from "@/constants";
import { updateTemperatureStatusBarItem, updateTokentatusBarItem } from '@/status_bar';

// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\configuration\all_accounts.ts
// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\extension.ts
// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\status_bar.ts

const get_active_url = `${API_BASE_URL}/get_active`;
const update_active_url = `${API_BASE_URL}/update_active`;
const get_mode_url = `${API_BASE_URL}/get_mode`;
const update_mode_url = `${API_BASE_URL}/update_mode`;
const get_invoke_all_url = `${API_BASE_URL}/get_invoke_all`;
const update_invoke_all_url = `${API_BASE_URL}/update_invoke_all`;

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

async function getFilesFromBackend(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/list_fmus_files`);
    return response.data;
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch files from the backend.');
    return [];
  }
}

async function selectFileOnBackend(selectedFile: string) {
  try {
    await axios.post(`${API_BASE_URL}/select_active_fmus_file`, { selected_file: selectedFile });
    vscode.window.showInformationMessage(`Selected file: ${selectedFile}`);
  } catch (error) {
    vscode.window.showErrorMessage('Failed to save the selected file to the backend.');
  }
}

async function fetchConfig(): Promise<ConfigInvokeAll> {
  try {
    const response = await axios.get(get_invoke_all_url);
    return response.data;
  } catch (error) {
    vscode.window.showErrorMessage("Failed to fetch configuration.");
    throw error;
  }
}

async function updateConfig(updatedConfig: ConfigInvokeAll): Promise<void> {
  try {
    await axios.post(update_invoke_all_url, { invoke_all: updatedConfig });
    vscode.window.showInformationMessage("Configuration updated successfully.");
  } catch (error) {
    vscode.window.showErrorMessage("Failed to update configuration.");
    throw error;
  }
}

async function fetchActive(): Promise<ActiveConfig> {
  const response = await axios.get(get_active_url);
  return response.data;
}

async function updateActive(newActive: string): Promise<void> {
  await axios.post(update_active_url, { active: newActive });
}

async function fetchSecondaryActive(): Promise<SecondaryActiveConfig> {
  const response = await axios.get(`${API_BASE_URL}/get_secondary_active`);
  return response.data;
}

async function updateSecondaryActive(newActive: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/update_secondary_active`, { secondary_active: newActive });
}

async function fetchMode(): Promise<ModeConfig> {
  const response = await axios.get(get_mode_url);
  return response.data;
}

async function updateMode(newMode: string): Promise<void> {
  await axios.post(update_mode_url, { mode: newMode });
}

let selectActive = vscode.commands.registerCommand(`${extension_name}.selectActive`, async () => {
  const activeConfig = await fetchActive();

  const selectedActive = await vscode.window.showQuickPick(activeConfig.options.map(option => ({
    label: option,
    picked: option === activeConfig.active
  })), {
    placeHolder: 'Select active account'
  });

  if (selectedActive) {
    await updateActive(selectedActive.label);
    vscode.window.showInformationMessage(`Active account updated to ${selectedActive.label}.`);
  }
});

let selectSecondaryActive = vscode.commands.registerCommand(`${extension_name}.selectSecondaryActive`, async () => {
  const activeConfig = await fetchSecondaryActive();
  const selectedActive = await vscode.window.showQuickPick(activeConfig.options.map((option) => ({
    label: option,
    picked: option === activeConfig.secondary_active
  })), {
    placeHolder: 'Select secondary active account'
  });
  if (selectedActive) {
    await updateSecondaryActive(selectedActive.label);
    vscode.window.showInformationMessage(`Secondary active account updated to ${selectedActive.label}.`);
  }
});

let selectInvokeAll = vscode.commands.registerCommand(`${extension_name}.selectInvokeAll`, async () => {
  const config = await fetchConfig();
  const items = Object.keys(config).map(key => ({
    label: key,
    picked: config[key] === 1
  }));
  const selectedItems = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: 'Select configuration items'
  });
  if (selectedItems) {
    const updatedConfig: ConfigInvokeAll = {};
    Object.keys(config).forEach(key => {
      updatedConfig[key] = selectedItems.some(item => item.label === key) ? 1 : 0;
    });
    await updateConfig(updatedConfig);
  }
});

let selectFmusFile = vscode.commands.registerCommand(`${extension_name}.selectFmusFile`, async () => {
  const files = await getFilesFromBackend();
  if (files.length === 0) {
    vscode.window.showInformationMessage('No .fmus files found.');
    return;
  }
  const selectedFile = await vscode.window.showQuickPick(files, {
    placeHolder: 'Select a .fmus file'
  });
  if (selectedFile) {
    console.log(`FMUS choice: ${selectedFile}`);
    await selectFileOnBackend(selectedFile);
  }
});

let selectMode = vscode.commands.registerCommand(`${extension_name}.selectMode`, async () => {
  const modeConfig = await fetchMode();
  const selectedMode = await vscode.window.showQuickPick(modeConfig.options.map(option => ({
    label: option,
    picked: option === modeConfig.mode
  })), {
    placeHolder: 'Select mode'
  });
  if (selectedMode) {
    await updateMode(selectedMode.label);
    vscode.window.showInformationMessage(`Mode updated to ${selectedMode.label}.`);
  }
});

const URL_GET_TEMPERATURE = `${API_BASE_URL}/config_get_temperature`;
const URL_SET_TEMPERATURE = `${API_BASE_URL}/config_set_temperature`;

const URL_GET_MAXTOKENS = `${API_BASE_URL}/config_get_maxtokens`;
const URL_SET_MAXTOKENS = `${API_BASE_URL}/config_set_maxtokens`;

const URL_GET_TOPP = `${API_BASE_URL}/config_get_top_p`;
const URL_SET_TOPP = `${API_BASE_URL}/config_set_top_p`;

const get_temperature = vscode.commands.registerCommand(`${extension_name}.get_temperature`, async () => {
  try {
    const response = await axios.get(URL_GET_TEMPERATURE);
    const config = response.data;
    vscode.window.showInformationMessage(`Temperature: ${config.temperature}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error fetching config: ${error.message}`);
  }
});

const set_temperature = vscode.commands.registerCommand(`${extension_name}.set_temperature`, async () => {
  const temperature = await vscode.window.showInputBox({ prompt: 'Enter temperature (0.0 to 1.0)' });
  // const maxOutputTokens = await vscode.window.showInputBox({ prompt: 'Enter max output tokens (greater than 0)' });
  const tempValue = temperature ? parseFloat(temperature) : 0.0;
  // const maxTokensValue = maxOutputTokens ? parseInt(maxOutputTokens, 10) : 4096;
  try {
    const response = await axios.post(URL_SET_TEMPERATURE, {
      temperature: tempValue,
    });
    const temperatureResult = response.data.temperature;
    updateTemperatureStatusBarItem(temperatureResult);
    vscode.window.showInformationMessage(`Config updated: Temperature: ${temperatureResult}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error updating config: ${error.message}`);
  }
});

/////////////////////////////////////////////// MAX_TOKENS
const get_maxtokens = vscode.commands.registerCommand(`${extension_name}.get_maxtokens`, async () => {
  try {
    const response = await axios.get(URL_GET_MAXTOKENS);
    const config = response.data;
    vscode.window.showInformationMessage(`Max Output Tokens: ${config.max_output_tokens}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error fetching config: ${error.message}`);
  }
});

const set_maxtokens = vscode.commands.registerCommand(`${extension_name}.set_maxtokens`, async () => {
  const maxOutputTokens = await vscode.window.showInputBox({ prompt: 'Enter max output tokens (greater than 0)' });
  const maxTokensValue = maxOutputTokens ? parseInt(maxOutputTokens, 10) : 4096;
  try {
    const response = await axios.post(URL_SET_MAXTOKENS, {
      max_output_tokens: maxTokensValue,
    });
    const maxTokenResult = response.data.max_output_tokens;
    updateTokentatusBarItem(maxTokenResult);
    vscode.window.showInformationMessage(`Config updated: Max Output Tokens: ${maxTokenResult}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error updating config: ${error.message}`);
  }
});

/////////////////////////////////////////////// TOP_P
const get_topp = vscode.commands.registerCommand(`${extension_name}.get_topp`, async () => {
  try {
    const response = await axios.get(URL_GET_TOPP);
    const config = response.data;
    vscode.window.showInformationMessage(`top_p: ${config.top_p}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error fetching config: ${error.message}`);
  }
});

const set_topp = vscode.commands.registerCommand(`${extension_name}.set_topp`, async () => {
  const top_p = await vscode.window.showInputBox({ prompt: 'Enter top_p (0.0 to 1.0)' });
  const tempValue = top_p ? parseFloat(top_p) : 0.0;
  try {
    const response = await axios.post(URL_SET_TOPP, {
      top_p: tempValue,
    });
    const top_p_result = response.data.top_p;
    // updateTemperatureStatusBarItem(top_p_result);
    vscode.window.showInformationMessage(`Config updated: top_p: ${top_p_result}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error updating config: ${error.message}`);
  }
});

export function register_llm_config_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(get_temperature);
  context.subscriptions.push(set_temperature);
  context.subscriptions.push(get_maxtokens);
  context.subscriptions.push(set_maxtokens);
  context.subscriptions.push(get_topp);
  context.subscriptions.push(set_topp);

  context.subscriptions.push(selectActive);
  context.subscriptions.push(selectSecondaryActive);
  context.subscriptions.push(selectInvokeAll);
  context.subscriptions.push(selectFmusFile);
  context.subscriptions.push(selectMode);
}
