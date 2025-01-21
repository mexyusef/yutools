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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_npm_package(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_npm_package`,
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
Here’s a step-by-step list of commands and actions to start an NPM package for a JavaScript project from start to finish, including key non-CLI activities.

### 1. **Initialize the Project**
bash
mkdir my-project
cd my-project
npm init -y

- mkdir my-project – Creates a directory for your project.
- cd my-project – Navigates into the project folder.
- npm init -y – Initializes a new NPM project with default settings (skips the interactive prompts).

### 2. **Install Dependencies (Optional)**
If your project requires packages, you can install them using:
bash
npm install <package-name> --save

Example (if you need **Express**):
bash
npm install express --save


For development dependencies:
bash
npm install <package-name> --save-dev

Example (for **ESLint**):
bash
npm install eslint --save-dev


### 3. **Edit Main Entry File**
By default, the main file is index.js or main.js (depending on package.json). If you need to create and edit it:

#### Create the entry file:
bash
touch index.js


#### Edit the index.js (Open in a text editor):
- Add your core JavaScript logic here.

Example:
javascript
// index.js
console.log("Hello, NPM Package!");


### 4. **Add Scripts in package.json**
Modify the package.json file to add useful scripts like:
json
"scripts": {
  "start": "node index.js",
  "test": "echo \\"Error: no test specified\\" && exit 1"
}

This enables running the app using:
bash
npm start


### 5. **Run the Project**
bash
npm start

This runs the project using the command defined in the "start" script in package.json.

### 6. **Linting and Formatting (Optional)**
To maintain code quality, add a linter such as **ESLint**.

#### Install ESLint:
bash
npm install eslint --save-dev


#### Initialize ESLint:
bash
npx eslint --init

Configure it based on your preferences.

### 7. **Add Version Control (Optional but recommended)**
Initialize a git repository if using version control:
bash
git init
git add .
git commit -m "Initial commit"


### 8. **Publish the Package (Optional)**
If you want to publish your package to the NPM registry:

#### Log in to NPM:
bash
npm login


#### Publish the package:
bash
npm publish


### 9. **Run Tests (If you add a testing framework)**
Install a testing framework like **Jest** or **Mocha**.

Example for **Jest**:
bash
npm install jest --save-dev


Add a script for testing in package.json:
json
"scripts": {
  "test": "jest"
}


Run tests:
bash
npm test


### Summary of Steps:
1. **Initialize Project:**
	- mkdir my-project, cd my-project, npm init -y
2. **Install Dependencies (if any):**
	- npm install <package>
3. **Edit Main File:**
	- touch index.js and code editing
4. **Edit package.json Scripts**
5. **Run the Project:**
	- npm start
6. **Linting & Formatting (Optional)**
	- npm install eslint --save-dev, npx eslint --init
7. **Add Version Control (Optional)**
	- git init, git commit
8. **Publish (Optional)**
	- npm publish
9. **Run Tests (Optional)**
	- npm install jest --save-dev, npm test

This covers the typical workflow of starting an NPM-based JavaScript project.
`;
