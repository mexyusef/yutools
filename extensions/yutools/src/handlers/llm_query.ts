import * as vscode from 'vscode';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { ActiveConfig, ActiveModelConfig } from '@/shared/types';

const get_active_url = `${API_BASE_URL}/get_active`;
const update_active_url = `${API_BASE_URL}/update_active`;
const get_active_model_url = `${API_BASE_URL}/get_active_model`;
const update_active_model_url = `${API_BASE_URL}/update_active_model`;

async function fetchActive(): Promise<ActiveConfig> {
	const response = await axios.get(get_active_url);
	return response.data;
}

async function updateActive(newActive: string): Promise<void> {
	await axios.post(update_active_url, { active: newActive });
}

export const selectActiveLLMProvider = async () => {
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
};

async function fetchActiveModels(): Promise<ActiveModelConfig> {
	const response = await axios.get(get_active_model_url);
	return response.data;
}

async function updateActiveModel(newActiveModel: string): Promise<void> {
	await axios.post(update_active_model_url, { active_model: newActiveModel });
}

export const selectActiveLLMProviderAndModel = async () => {
	// Step 1: Select active LLM provider
	const activeConfig = await fetchActive();

	const selectedActive = await vscode.window.showQuickPick(
		activeConfig.options.map(option => ({
			label: option,
			picked: option === activeConfig.active
		})),
		{
			placeHolder: 'Select active LLM provider'
		}
	);

	if (selectedActive) {
		await updateActive(selectedActive.label);
		vscode.window.showInformationMessage(`Active provider updated to ${selectedActive.label}.`);

		// Step 2: Fetch and select model for the active provider
		const activeModelConfig = await fetchActiveModels();

		const selectedModel = await vscode.window.showQuickPick(
			activeModelConfig.options.map(option => ({
				label: option,
				picked: option === activeModelConfig.active_model
			})),
			{
				placeHolder: `Select model for provider ${selectedActive.label}`
			}
		);

		if (selectedModel) {
			await updateActiveModel(selectedModel.label);
			vscode.window.showInformationMessage(`Active model for ${selectedActive.label} updated to ${selectedModel.label}.`);
		}
	}
};

export const selectActiveModel = async () => {
	// Fetch available models for the active provider
	const activeModelConfig = await fetchActiveModels();

	// Let the user select a model from the available options
	const selectedModel = await vscode.window.showQuickPick(
		activeModelConfig.options.map(option => ({
			label: option,
			picked: option === activeModelConfig.active_model
		})),
		{
			placeHolder: `Select a model for the active provider`
		}
	);

	// If a model is selected, update the active model
	if (selectedModel) {
		await updateActiveModel(selectedModel.label);
		vscode.window.showInformationMessage(`Active model updated to ${selectedModel.label}.`);
	}
};
