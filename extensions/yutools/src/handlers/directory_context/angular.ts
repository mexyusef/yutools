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
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\handlers\\directory_context\\angular.ts=BACA.md)
`;

export function register_dir_context_create_angular(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_angular`, async (uri: vscode.Uri) => {
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
Here is a step-by-step guide to starting and setting up an Angular project from start to finish, including CLI commands and development tasks:

### 1. **Install Angular CLI** (if not already installed)
bash
npm install -g @angular/cli


### 2. **Create a New Angular Project**
bash
ng new my-angular-app

- It will prompt you for configurations like:
	- Would you like to add Angular routing? (Yes/No)
	- Which stylesheet format would you like to use? (CSS, SCSS, etc.)

### 3. **Navigate to the Project Directory**
bash
cd my-angular-app


### 4. **Serve the Application**
bash
ng serve

- The app will be available at http://localhost:4200/.

---

### 5. **Edit Main Files** (Non-CLI)
These are tasks for you to manually perform during development:

#### **a. Edit src/app/app.component.html**
- Replace the default content with your custom HTML.

#### **b. Edit src/app/app.component.ts**
- Add your component logic or update the component class as necessary.

#### **c. Edit src/app/app.component.css or app.component.scss**
- Add custom styles for your component.

#### **d. Update src/app/app.module.ts**
- Register any new components, modules, or services.

---

### 6. **Generate New Components**
bash
ng generate component component-name

or
bash
ng g c component-name


### 7. **Generate Services**
bash
ng generate service service-name

or
bash
ng g s service-name


### 8. **Generate Modules**
bash
ng generate module module-name

or
bash
ng g m module-name


### 9. **Build for Production**
bash
ng build --prod

- The output will be generated in the dist/ directory.

### 10. **Run Tests** (Unit Tests)
bash
ng test


### 11. **Run End-to-End Tests** (Optional, if e2e is set up)
bash
ng e2e


---

### Additional Tasks During Development

- **Install additional packages** (if needed):
	bash
	npm install <package-name>


- **Configure routing** by modifying app-routing.module.ts to define your application routes.

- **Environment setup**: Edit src/environments/environment.ts for environment-specific variables.

- **Optimization/Performance**:
	- Use lazy loading for modules.
	- Enable Ahead-of-Time (AOT) compilation:
		bash
		ng build --aot


This provides a basic flow for setting up and working on an Angular project from start to finish.
`;
