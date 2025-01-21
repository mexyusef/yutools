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

export function register_dir_context_create_extension_chrome(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_extension_chrome`,
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
Here’s a step-by-step guide to start a Chrome Extension project using TypeScript, from start to finish. I’ll include both CLI commands and development tasks (like editing files) as required.

### 1. **Initialize the Project**
bash
mkdir my-chrome-extension
cd my-chrome-extension
npm init -y


### 2. **Install Required Dependencies**
Install typescript, webpack, and other necessary packages for bundling the TypeScript code.
bash
npm install typescript webpack webpack-cli webpack-dev-server ts-loader --save-dev


### 3. **Install Types for Chrome Extensions**
bash
npm install @types/chrome --save-dev


### 4. **Create tsconfig.json for TypeScript Configuration**
bash
npx tsc --init


Edit tsconfig.json to target ESNext and enable module resolution:
json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"outDir": "./dist",
		"moduleResolution": "node",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	"include": ["src/**/*"]
}


### 5. **Create a webpack.config.js for Bundling**
Create the file webpack.config.js:
javascript
const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	mode: 'development',
};


### 6. **Set Up the Directory Structure**
Create the following folders and files:
bash
mkdir src
touch src/index.ts
mkdir public
touch public/manifest.json


### 7. **Edit manifest.json**
Edit public/manifest.json to define the extension's metadata:
json
{
	"manifest_version": 3,
	"name": "My Chrome Extension",
	"version": "1.0",
	"description": "A simple Chrome extension using TypeScript",
	"action": {
		"default_popup": "popup.html"
	},
	"background": {
		"service_worker": "bundle.js"
	},
	"permissions": ["storage", "activeTab", "scripting"],
	"host_permissions": ["<all_urls>"]
}


### 8. **Add Content to src/index.ts**
This will be your main background script:
typescript
chrome.runtime.onInstalled.addListener(() => {
	console.log('Extension installed');
});


### 9. **Create a Popup HTML File**
Add a popup.html file in the public folder:
html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Popup</title>
</head>
<body>
	<h1>Hello from Popup!</h1>
</body>
</html>


### 10. **Build the Project**
bash
npx webpack --config webpack.config.js


### 11. **Load the Extension in Chrome**
1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode"
3. Click on "Load unpacked" and select the public directory.

### 12. **Start Webpack Dev Server for Development**
(Optional, for auto-reload during development):
bash
npx webpack-dev-server --config webpack.config.js


### 13. **Testing and Iterating**
- **Edit files**: Make changes to src/index.ts or manifest.json.
- **Rebuild**: Run npx webpack or restart the dev server.
- **Reload extension**: Refresh the extension in Chrome to see the changes.

This process should get your Chrome extension up and running with TypeScript and Webpack!
`;
