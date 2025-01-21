/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../../base/common/uri.js';
import { dirname } from '../../../../../base/common/resources.js';
import { ITextModel } from '../../../../common/model.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';

/**
 * Get the directory of the current file in the active editor.
 * If the file is an "Untitled" file, fall back to the configured current working directory.
 *
 * @param activeEditor - The active editor instance.
 * @param configurationService - The IConfigurationService instance to access settings.
 * @returns The directory of the file or the configured current working directory if the file is "Untitled".
 */
export function getFileOrWorkingDirectory(activeEditor: any, configurationService: IConfigurationService): string {
	const model = activeEditor.getModel() as ITextModel | null;

	if (model) {
		const uri: URI = model.uri;
		const filePath = uri.fsPath;

		// Check if this is an "Untitled" file
		if (!filePath || filePath === '') {
			// Use the current working directory from the configuration service
			const currentWorkingDirectory = configurationService.getValue<string>('fulled.currentWorkingDirectory');
			return currentWorkingDirectory || '.'; // Default to '.' if not set
		}

		// Otherwise, return the directory of the real file
		const directory = dirname(uri).fsPath;
		return directory;
	}

	return ''; // Return empty string if no model is present
}

// fileUtils.ts:
//     getFileOrWorkingDirectory: Get the directory of the active file, falling back to a working directory if it’s "Untitled".

// import { getFileOrWorkingDirectory } from './fulled/fileUtils';
// import { executeFulledFloatingCursorCommand } from './fulled/commandUtils';
// import { ICommandService } from '../../../../../platform/commands/common/commands';
// import { IConfigurationService } from '../../../../../platform/configuration/common/configuration';

// export class MyCustomWidget {
//   constructor(
//     @ICommandService private readonly commandService: ICommandService,
//     @IConfigurationService private readonly configurationService: IConfigurationService
//   ) {}

//   handleEditor() {
//     const activeEditor = ...; // Get active editor
//     const directory = getFileOrWorkingDirectory(activeEditor, this.configurationService);
//     console.log('Directory:', directory);
//   }

//   triggerCommand() {
//     executeFulledFloatingCursorCommand(this.commandService);
//   }
// }

