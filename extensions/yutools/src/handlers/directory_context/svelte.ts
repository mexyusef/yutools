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

export function register_dir_context_create_svelte(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_svelte`,
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
Here's a step-by-step guide on how to start and set up a Svelte project from start to finish, including development activities like editing key files:

### 1. **Install Node.js (if not already installed)**
	- [Download Node.js](https://nodejs.org) and install it on your system.

### 2. **Install Svelte project template using Vite**

	bash
	npm create vite@latest my-svelte-app -- --template svelte

	- This command will prompt you to choose the framework. Select **Svelte** as the template.

### 3. **Navigate into the project directory**

	bash
	cd my-svelte-app


### 4. **Install dependencies**

	bash
	npm install


### 5. **Start the development server**

	bash
	npm run dev

	- This will start a development server, usually at http://localhost:5173.

### 6. **Edit the main files for development**

	- **Edit src/App.svelte:**
	  - Open src/App.svelte and start building your app. This is the main component that gets rendered by default.
	  - Modify or add new components based on your app requirements.

### 7. **Create and edit additional components**

	- Create new .svelte files in the src folder (e.g., src/components/Header.svelte).
	- Import and use these components in App.svelte or other components.

### 8. **Adjust the project’s styling (optional)**

	- Edit or add styles in App.svelte or create a global style file to style your components.
	- You can use regular CSS, or add libraries like TailwindCSS.

### 9. **Configure additional packages or tools (optional)**

	- Install any additional packages or plugins for your project needs (e.g., routing, state management, animations).
	- Example: Install **SvelteKit** for advanced routing or **Svelte store** for state management.

	bash
	npm install svelte-spa-router # for routing


### 10. **Build the project for production**

	bash
	npm run build


### 11. **Preview the production build (optional)**

	bash
	npm run preview


### 12. **Deploy the app**

	- Once the app is built, deploy the contents of the dist directory to your chosen hosting service (e.g., Netlify, Vercel, or any other static site hosting service).

### Summary of Commands and Activities:
bash
# 1. Create a new Svelte project
npm create vite@latest my-svelte-app -- --template svelte

# 2. Navigate to project directory
cd my-svelte-app

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Edit the main file
<edit src/App.svelte>

# 6. Add components and edit them
<create and edit components in src folder>

# 7. Install additional packages
npm install <package-name>

# 8. Build for production
npm run build

# 9. Preview production build
npm run preview


This is a comprehensive list of both commands and key activities involved in creating and developing a Svelte project from start to finish!
`;
