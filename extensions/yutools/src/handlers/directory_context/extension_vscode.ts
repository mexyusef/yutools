import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `echo __VAR1__`;

const fmus_code_wrapper = `
--% BACA.md
bacaan utk extension vscode
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	%__FILE__=C:\\ai\\yuagent\\extensions\\yutools\\src\\handlers\\directory_context\\extension_vscode.ts
	DIR_PROYEK,d
		src,d
		run.bat,f(n=ls -al)
		build.bat,f(n=ls -al)
		BACA.md,f(e=__FILE__=BACA.md)
		BACA2.md,f(e=C:\\ai\\yuagent\\extensions\\yutools\\src\\handlers\\directory_context\\extension_vscode.ts=BACA.md)
`;

export function register_dir_context_create_extension_vscode(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_extension_vscode`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath);

			const result_map = await processCommandWithMap(command_v1);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);
				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText("rem siap-siap buat vscode extension");
				terminal.sendText(result_map.result);
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath);
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}
		});
	context.subscriptions.push(disposable);
}


const information = `
Here’s a step-by-step list of commands and activities to start and complete a Visual Studio Code (VSCode) extension project:

### 1. **Install Node.js and npm (if not already installed)**:
	- Check Node.js installation:
	  bash
	  node -v

	- Check npm installation:
	  bash
	  npm -v


### 2. **Install yo (Yeoman) and generator-code globally**:
	These tools will help scaffold a new VSCode extension project.
	bash
	npm install -g yo generator-code


### 3. **Generate a new VSCode extension**:
	Run Yeoman to generate the basic structure for the VSCode extension:
	bash
	yo code

	During this process, you'll be prompted for the following options:
	- TypeScript or JavaScript
	- Extension Name
	- Extension Identifier
	- Extension Description

### 4. **Navigate to the newly created project directory**:
	bash
	cd <extension-directory>


### 5. **Install project dependencies**:
	The generator will create a package.json file. You’ll need to install the project dependencies:
	bash
	npm install


### 6. **<Editing src/extension.ts or src/extension.js file>**:
	Modify the main extension entry file (usually src/extension.ts or src/extension.js) to add the logic for your extension. This is where you’ll define the activation logic, commands, and behaviors.

### 7. **Update package.json for new commands and contributions**:
	Add new commands and contributions to the package.json under the "contributes" and "commands" sections. This file defines how your extension integrates with VSCode.

### 8. **Compile TypeScript (if using TypeScript)**:
	If your project is in TypeScript, you’ll need to compile the TypeScript code:
	bash
	npm run compile


### 9. **Test the extension**:
	You can run and test the extension directly in a new VSCode window:
	bash
	code .

	Press F5 or select **Run > Start Debugging** in VSCode to launch an extension development host for testing your extension.

### 10. **<Debug the extension>**:
	Set breakpoints and use the debugging tools provided by VSCode to step through your code and ensure it behaves as expected.

### 11. **Publish the extension**:
	- **Install vsce (Visual Studio Code Extension Manager)**:
	  bash
	  npm install -g vsce

	- **Login to your Microsoft account (optional)** if using the VSCode marketplace:
	  bash
	  vsce login <publisher-name>

	- **Publish the extension**:
	  First, ensure you’ve set up a publisher on the [VSCode Marketplace](https://marketplace.visualstudio.com/manage). Afterward:
	  bash
	  vsce publish

	Alternatively, create a .vsix file for manual distribution:
	bash
	vsce package


### 12. **Versioning (optional)**:
	Update the version number in package.json before publishing an update. Use the vsce command to automatically update and publish:
	bash
	vsce publish <version>


### 13. **<Update README.md and CHANGELOG.md>**:
	Ensure that you have appropriate documentation in README.md and a detailed changelog in CHANGELOG.md to describe the extension’s functionality and updates.

### 14. **(Optional) Test and lint the code**:
	Set up testing and linting for your project, especially if you plan to maintain it long-term:
	- Install ESLint:
	  bash
	  npm install eslint --save-dev

	- Run ESLint:
	  bash
	  npm run lint


This process will help you scaffold, develop, test, and publish your VSCode extension from start to finish.
`;
