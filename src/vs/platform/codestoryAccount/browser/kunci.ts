/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri';
import { IFileService } from '../../files/common/files';

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

const CONFIG_FILE_PATH = 'c:\\users\\usef\\XAI_API_KEYS.json';

export async function loadKeysFromFile(
	fileService: IFileService,
	configFile: string = CONFIG_FILE_PATH // `CONFIG_FILE_PATH` should still be a string
): Promise<LLMProviderKeys> {
	console.log(`		loadKeysFromFile #1.`);
	const fileUri = URI.file(configFile);
	console.log(`		loadKeysFromFile #2.`);
	const fileContent = await fileService.readFile(fileUri);
	console.log(`		loadKeysFromFile #3: fileContent = ${fileContent}`);
	return JSON.parse(fileContent.value.toString());
}

export async function getNextProvider(
	fileService: IFileService,
): Promise<LLMProviderKey> {
	console.log(`getNextProvider #1.`);
	const USE_LLM_PROVIDER_KEYS = await loadKeysFromFile(fileService,);
	console.log(`getNextProvider #2.`);
	if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
		throw new Error('No providers found in apiKeys.ts');
	}
	console.log(`getNextProvider #3.`);
	USE_LLM_PROVIDER_KEYS.forEach((p) => {
		if (p.uses === undefined) {
			p.uses = 0;
		}
	});
	console.log(`getNextProvider #4.`);
	const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));
	const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
	const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
	console.log(`getNextProvider #5.`);
	selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;
	console.log(`getNextProvider #6.`);
	return selectedProvider;
}
