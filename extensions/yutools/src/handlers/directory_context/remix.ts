import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `echo __VAR1__`;

const fmus_code_wrapper = `
--% BACA.md
dummy baca md
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		run.bat,f(n=ls -al)
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_remix(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_remix`,
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
				terminal.sendText(result_map.result);
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath);
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}
		});
	context.subscriptions.push(disposable);
}


const information = `
Here's a step-by-step guide with commands and key activities to start a Remix project using TypeScript from start to finish:

1. **Install Node.js**
	If not already installed, make sure you have Node.js installed. You can download it [here](https://nodejs.org/).

2. **Create a Remix Project**
	bash
	npx create-remix@latest

	Follow the prompts to choose the project directory, TypeScript, and deployment target.

3. **Navigate to the Project Directory**
	bash
	cd <your-project-directory>


4. **Install Dependencies**
	bash
	npm install


5. **Configure TypeScript (if not already set up)**
	If you chose JavaScript earlier or TypeScript was not auto-configured, you can manually configure it by adding the necessary tsconfig.json file:
	bash
	npx tsc --init


6. **Start the Development Server**
	bash
	npm run dev

	This starts the Remix app in development mode, with hot reloading.

7. **Edit Main Entry Files (app/routes/index.tsx)**
	Open app/routes/index.tsx to start editing your main file for the application's entry route.

8. **Edit Root File (app/root.tsx)**
	Customize the root layout, error handling, and other global logic in app/root.tsx.

9. **Edit Environment Configurations (if needed)**
	Modify .env or configuration files to set environment variables.

10. **Build the Project**
	 Before deployment, build the project:
	 bash
	 npm run build


11. **Run the Production Build**
	 Test the production build locally:
	 bash
	 npm start


12. **Deploy the Project**
	 Depending on the platform, follow the Remix documentation or deploy to your target environment like Netlify, Vercel, or others.

This list provides the necessary steps from project setup to deployment.
`;
