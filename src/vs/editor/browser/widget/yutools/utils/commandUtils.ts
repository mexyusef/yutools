/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ICommandService } from '../../../../../platform/commands/common/commands.js';

/**
 * Executes a VS Code command.
 *
 * @param commandService - The ICommandService instance.
 * @param commandId - The ID of the command to execute.
 * @param args - Optional arguments to pass to the command.
 * @returns A promise that resolves when the command has executed.
 */
export function executeVSCodeCommand(commandService: ICommandService, commandId: string, ...args: any[]): Promise<void> {
	return commandService.executeCommand(commandId, ...args).then(() => {
		console.log(`Command ${commandId} executed successfully`);
	}).catch((err) => {
		console.error(`Error executing command ${commandId}:`, err);
	});
}

/**
 * Executes the 'fulled.floatingcursorwidget_handler' command.
 *
 * @param commandService - The ICommandService instance.
 * @returns A promise that resolves when the command has executed.
 */
export function executeFulledFloatingCursorCommand(commandService: ICommandService): Promise<void> {
	return executeVSCodeCommand(commandService, 'fulled.floatingcursorwidget_handler');
}

// commandUtils.ts:
//     executeVSCodeCommand: Run any VS Code command by its ID.
//     executeFulledFloatingCursorCommand: Specifically run the fulled.floatingcursorwidget_handler command.
// import { executeVSCodeCommand, executeFulledFloatingCursorCommand } from './fulled/commandUtils';
// import { ICommandService } from 'vs/platform/commands/common/commands';

// export class MyCustomWidget {
//   constructor(@ICommandService private readonly commandService: ICommandService) {}

//   runSomeCommand() {
//     executeVSCodeCommand(this.commandService, 'some.otherCommand');
//   }

//   runFulledFloatingCursorCommand() {
//     executeFulledFloatingCursorCommand(this.commandService);
//   }
// }

// [17172:1006/103052.035:INFO:CONSOLE(18)]
// "Error executing command fulled.set_current_working_directory_to_dir_selection: Error: Cannot read properties of undefined (reading 'fsPath')",
// source: vscode-file://vscode-app/c:/ai/fulled/out/vs/editor/browser/widget/fulled/utils/commandUtils.js (18)

// [22248:1006/103531.047:INFO:CONSOLE(16)]
// "Command fulled.set_current_working_directory_to_dir_selection executed successfully",
// source: vscode-file://vscode-app/c:/ai/fulled/out/vs/editor/browser/widget/fulled/utils/commandUtils.js (16)
