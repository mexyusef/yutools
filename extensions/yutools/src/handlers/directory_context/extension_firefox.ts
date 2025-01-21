import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `echo __VAR1__`;

const fmus_code_wrapper = `
--% BACA.md
Buat firefox extension.
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		build.bat,f(n=web-ext build)
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_extension_firefox(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_extension_firefox`,
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
Here is a step-by-step list of commands and activities to start and develop a Firefox extension project using TypeScript:

### 1. **Create Project Directory**
bash
mkdir my-firefox-extension
cd my-firefox-extension


### 2. **Initialize NPM Project**
bash
npm init -y


### 3. **Install Required Dependencies**
- Install TypeScript, Webpack (for bundling), and other necessary packages:
bash
npm install --save-dev typescript webpack webpack-cli copy-webpack-plugin ts-loader


### 4. **Install TypeScript Definitions for Firefox Extensions**
bash
npm install --save-dev @types/firefox-webext-browser


### 5. **Create tsconfig.json for TypeScript Configuration**
bash
npx tsc --init

Modify tsconfig.json as needed, ensuring it targets ES6 or later.

### 6. **Create Webpack Configuration File webpack.config.js**
Create a webpack.config.js file to bundle your TypeScript files.
javascript
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
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
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: 'public', to: '.' }],
		}),
	],
};


### 7. **Create Project Structure**
bash
mkdir src public
touch src/index.ts
touch public/manifest.json


### 8. **Create manifest.json File**
This file describes your extension. Edit public/manifest.json:
json
{
	"manifest_version": 2,
	"name": "My Firefox Extension",
	"version": "1.0",
	"description": "A sample Firefox extension.",
	"background": {
		"scripts": ["bundle.js"]
	},
	"permissions": ["storage"],
	"browser_action": {
		"default_popup": "popup.html",
		"default_icon": "icon.png"
	}
}


### 9. **Editing Main File src/index.ts**
- Open src/index.ts and add the logic for your extension:
typescript
console.log("My Firefox Extension is running");


### 10. **Create Assets (HTML, Icons, etc.)**
- Example: popup.html inside the public folder:
html
<!DOCTYPE html>
<html>
	<head>
		<title>Popup</title>
	</head>
	<body>
		<h1>Hello, Firefox Extension!</h1>
	</body>
</html>


### 11. **Build the Project**
bash
npx webpack --config webpack.config.js


### 12. **Load the Extension in Firefox**
1. Open Firefox and go to about:debugging.
2. Click on "This Firefox" > "Load Temporary Add-on."
3. Select any file from the dist folder (e.g., manifest.json).

### 13. **Set Up Watch for Auto-Compilation**
To continuously watch and compile changes:
bash
npx webpack --watch


### 14. **Test and Debug in Firefox**
You can now interact with the extension in Firefox, use the browser's developer tools to debug, and monitor console logs.

---

By following this list of commands and activities, you will create a working Firefox extension with TypeScript.
`;
