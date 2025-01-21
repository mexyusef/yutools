import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, processCommandWithMap } from '../stringutils';
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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\desktop_electron.ts=BACA.md)
`;

export function register_dir_context_create_desktop_electron(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_desktop_electron`,
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
Here's a step-by-step guide, including the commands and activities required to start a TypeScript and Electron project from scratch. I’ve structured it with the necessary commands and development activities.

### 1. **Initialize Node.js Project**
	 - **Command**:
		 bash
		 npm init -y

		 This creates a package.json file, the main file for managing dependencies.

### 2. **Install Electron**
	 - **Command**:
		 bash
		 npm install --save-dev electron

		 Installs Electron as a dev dependency.

### 3. **Install TypeScript**
	 - **Command**:
		 bash
		 npm install --save-dev typescript

		 Installs TypeScript as a dev dependency.

### 4. **Initialize TypeScript Configuration**
	 - **Command**:
		 bash
		 npx tsc --init

		 This creates a tsconfig.json file with default settings. You'll want to modify it for Electron.

### 5. **Install Electron Types**
	 - **Command**:
		 bash
		 npm install --save-dev @types/node @types/electron

		 Installs TypeScript type definitions for Node.js and Electron.

### 6. **Setup Basic Folder Structure**
	 - **Activity**: Create a folder structure
		 text
		 /src
		 ├── main.ts   // Electron main process
		 └── renderer.ts // Electron renderer process


### 7. **Editing Main File (main.ts)**
	 - **Activity**: Create a main.ts file in the src folder and add this boilerplate code:
		 ts
		 import { app, BrowserWindow } from 'electron';
		 import * as path from 'path';

		 let mainWindow: BrowserWindow;

		 function createWindow() {
			 mainWindow = new BrowserWindow({
				 width: 800,
				 height: 600,
				 webPreferences: {
					 preload: path.join(__dirname, 'preload.js'),
					 nodeIntegration: true,
				 },
			 });

			 mainWindow.loadFile('index.html');
		 }

		 app.on('ready', createWindow);


### 8. **Create index.html for the Renderer**
	 - **Activity**: In the project root, create an index.html file to be loaded by the Electron window.
		 html
		 <!DOCTYPE html>
		 <html lang="en">
		 <head>
			 <meta charset="UTF-8">
			 <meta name="viewport" content="width=device-width, initial-scale=1.0">
			 <title>Electron with TypeScript</title>
		 </head>
		 <body>
			 <h1>Hello from Electron!</h1>
		 </body>
		 </html>


### 9. **Create renderer.ts File**
	 - **Activity**: Create a renderer.ts file in the src folder if you need to handle front-end logic.
		 ts
		 console.log('Hello from the renderer process!');


### 10. **Setup TypeScript Build Script**
	 - **Command**:
		 Update package.json scripts section to include a build script:
		 json
		 "scripts": {
			 "build": "tsc",
			 "start": "npm run build && electron ."
		 }


### 11. **Configure Electron to Use Compiled JavaScript**
	 - **Activity**: Update the tsconfig.json file to specify output directory and module handling:
		 json
		 {
			 "compilerOptions": {
				 "outDir": "./dist",
				 "module": "commonjs",
				 "target": "es6",
				 "strict": true,
				 "esModuleInterop": true
			 },
			 "include": ["src/**/*.ts"],
			 "exclude": ["node_modules"]
		 }

	 - **Activity**: Update the main.ts and renderer.ts paths in Electron to point to the compiled JavaScript in dist/ after TypeScript builds.

### 12. **Build TypeScript Files**
	 - **Command**:
		 bash
		 npm run build


### 13. **Run the Electron App**
	 - **Command**:
		 bash
		 npm start


### 14. **Auto-Reload Setup (Optional for Development)**
	 - **Command**:
		 To make Electron reload automatically on changes, install electron-reload:
		 bash
		 npm install electron-reload

	 - **Activity**: Add this code to your main.ts to enable auto-reloading:
		 ts
		 import * as path from 'path';
		 require('electron-reload')(path.join(__dirname, '../src'));


### 15. **Package the App (Optional for Distribution)**
	 - **Command**:
		 You can use Electron Packager or Electron Builder to package the app:
		 bash
		 npm install --save-dev electron-packager
		 npx electron-packager . --platform=win32 --arch=x64 --out=release-build


---

This workflow should take you from initialization to building and running a TypeScript-based Electron app!
`;
