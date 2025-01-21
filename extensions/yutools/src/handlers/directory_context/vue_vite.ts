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

export function register_dir_context_create_vue_vite(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_vue_vite`,
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
Here is a step-by-step guide on how to start and set up a Vue project from start to finish, including CLI commands and manual steps:

1. **Install Node.js**
	Make sure you have Node.js installed on your machine. If not, download and install it from [https://nodejs.org/](https://nodejs.org/).

2. **Install Vue CLI globally**
	bash
	npm install -g @vue/cli


3. **Create a new Vue project**
	bash
	vue create my-vue-project

	- Follow the prompts to select the desired features (you can choose default settings for a basic setup).

4. **Navigate into the project directory**
	bash
	cd my-vue-project


5. **Run the development server**
	bash
	npm run serve

	- This will start a local development server. You can now access your project in the browser at http://localhost:8080/.

6. **Edit the main file (App.vue or main.js)**
	- Open src/App.vue or src/main.js in your code editor and start modifying the structure or design of your application. You can edit components or add new ones as needed.

7. **Install additional libraries (optional)**
	If you need additional packages (e.g., Vue Router, Vuex, etc.), you can install them via npm:
	- Vue Router (for navigation):
	  bash
	  npm install vue-router

	- Vuex (for state management):
	  bash
	  npm install vuex


8. **Import and configure installed packages (if necessary)**
	After installing additional libraries, you need to import and configure them in your main files (e.g., main.js).

9. **Add custom components**
	- You can create new components inside the src/components/ folder.
	- Use the following syntax to include them in App.vue or other components:
	  html
	  <template>
		 <div>
			<MyComponent />
		 </div>
	  </template>

	  <script>
	  import MyComponent from './components/MyComponent.vue';

	  export default {
		 components: {
			MyComponent
		 }
	  };
	  </script>


10. **Build the project for production**
	 Once development is done, build the project for production:
	 bash
	 npm run build


11. **Serve the production build (optional)**
	 To preview the production build locally:
	 bash
	 npm install -g serve
	 serve -s dist


12. **Deploy the project (optional)**
	 - Depending on your hosting solution (e.g., Netlify, Vercel, or any other server), you may need to upload the dist/ folder.

That's the complete process from start to finish for setting up and developing a Vue.js project.
`;
