/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';

/**
 * Reads a configuration value from VS Code settings.
 *
 * @param configurationService - The IConfigurationService instance.
 * @param key - The key of the configuration value.
 * @returns The configuration value or undefined if not set.
 */
export function readConfigValue<T>(configurationService: IConfigurationService, key: string): T | undefined {
	return configurationService.getValue<T>(key);
}

/**
 * Writes a configuration value to VS Code settings.
 *
 * @param configurationService - The IConfigurationService instance.
 * @param key - The key of the configuration value.
 * @param value - The value to write to the settings.
 * @returns A promise that resolves when the configuration is updated.
 */
export async function writeConfigValue<T>(configurationService: IConfigurationService, key: string, value: T): Promise<void> {
	await configurationService.updateValue(key, value);
	console.log(`Configuration ${key} updated to`, value);
}

// storageUtils.ts:
//     readConfigValue: Read any configuration value by key.
//     writeConfigValue: Update or write any configuration value by key.

// import { readConfigValue, writeConfigValue } from './fulled/storageUtils';
// import { IConfigurationService } from '../../../../../platform/configuration/common/configuration';

// export class MyCustomWidget {
//   constructor(@IConfigurationService private readonly configurationService: IConfigurationService) {}

//   getCurrentWorkingDirectory() {
//     const currentWorkingDirectory = readConfigValue<string>(this.configurationService, 'fulled.currentWorkingDirectory');
//     console.log('Current Working Directory:', currentWorkingDirectory);
//     return currentWorkingDirectory;
//   }

//   setCurrentWorkingDirectory(newDir: string) {
//     writeConfigValue(this.configurationService, 'fulled.currentWorkingDirectory', newDir);
//   }
// }
