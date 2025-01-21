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

export function register_dir_context_create_python_package(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_package`,
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
Here's a list of steps and commands to create a Python package using Poetry from start to finish, including relevant development tasks:

### 1. **Install Poetry**
	If Poetry is not installed, install it using the following command:
	bash
	curl -sSL https://install.python-poetry.org | python3 -


### 2. **Create a New Poetry Project**
	Create a new Poetry project in a directory:
	bash
	poetry new my_package


### 3. **Navigate to the Project Directory**
	Change into the newly created project directory:
	bash
	cd my_package


### 4. **Edit the pyproject.toml File**
	Update the pyproject.toml file with package metadata, like description, version, authors, dependencies, etc.

### 5. **Install Dependencies**
	If you need to add external dependencies, you can do so using:
	bash
	poetry add <dependency_name>


	Example:
	bash
	poetry add requests


### 6. **Activate a Virtual Environment**
	Poetry automatically manages virtual environments. You can activate it by:
	bash
	poetry shell


### 7. **Edit the Main File**
	Open the my_package/__init__.py or my_package/my_package.py (if any) and start adding your package logic.

### 8. **Write Unit Tests**
	Poetry generates a tests folder. Write your unit tests in the tests folder by editing the files or creating new ones:
	python
	# Example test in tests/test_my_package.py
	def test_something():
		 assert True


### 9. **Run Tests**
	Use Poetry to run your tests (using pytest if installed):
	bash
	poetry run pytest


### 10. **Build the Package**
	Build the package using:
	bash
	poetry build


### 11. **Publish the Package (Optional)**
	If you want to publish the package to PyPI, configure your PyPI credentials and run:
	bash
	poetry publish --username <your_username> --password <your_password>


### 12. **Run Your Package (Locally)**
	You can run your package locally by installing it:
	bash
	poetry install


### 13. **Deactivate the Virtual Environment**
	When you are done, deactivate the Poetry shell with:
	bash
	exit


### 14. **Push to a Version Control System (Optional)**
	Initialize a Git repository, commit the changes, and push to GitHub or other version control systems:
	bash
	git init
	git add .
	git commit -m "Initial commit"
	git remote add origin <repository_url>
	git push -u origin master


This workflow covers creating a new package, adding dependencies, running tests, building the package, and even publishing it.
`;
