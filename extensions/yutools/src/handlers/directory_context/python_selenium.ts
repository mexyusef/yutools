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

export function register_dir_context_create_python_selenium(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_selenium`,
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
Here’s a step-by-step list of commands and activities to start a Python Selenium project from start to finish, including development activities:

### 1. **Create Project Directory**
bash
mkdir selenium_project
cd selenium_project


### 2. **Create and Activate a Virtual Environment**
bash
python -m venv venv
source venv/bin/activate  # On Windows, use venv\\Scripts\\activate


### 3. **Install Selenium**
bash
pip install selenium


### 4. **Install WebDriver (for example, ChromeDriver)**
	- **Download ChromeDriver**: https://sites.google.com/chromium.org/driver/
	- Place it in your project folder or a location in your system's PATH.

	OR, use a tool like webdriver-manager to automate this step:
bash
pip install webdriver-manager


### 5. **Create Project Files**
bash
touch main.py  # Create the main Python file


### 6. **Editing the Main File** (main.py)
	- Write a basic Selenium script to load a webpage.
	- Example:
	python
	from selenium import webdriver
	from webdriver_manager.chrome import ChromeDriverManager

	driver = webdriver.Chrome(ChromeDriverManager().install())
	driver.get('https://www.example.com')
	print(driver.title)
	driver.quit()


### 7. **Run the Script**
bash
python main.py


### 8. **Install Any Additional Tools (Optional)**
	- **For Headless Browsing**:
	bash
	pip install pyvirtualdisplay  # Optional for running browsers headlessly on servers

	- **For Unit Testing**:
	bash
	pip install pytest


### 9. **Create a Test File** (for unit testing with pytest)
bash
touch test_selenium.py


### 10. **Edit Test File** (test_selenium.py)
	- Example:
	python
	import pytest
	from selenium import webdriver
	from webdriver_manager.chrome import ChromeDriverManager

	def test_page_title():
		 driver = webdriver.Chrome(ChromeDriverManager().install())
		 driver.get('https://www.example.com')
		 assert driver.title == 'Example Domain'
		 driver.quit()


### 11. **Run Tests**
bash
pytest


### 12. **Deactivation and Cleanup**
	- **Deactivate Virtual Environment**:
	bash
	deactivate


	- **Remove WebDriver** (if necessary):
	bash
	rm chromedriver  # or whichever WebDriver you used


### Optional: **Use a .gitignore File**
bash
touch .gitignore


Add common files to ignore:

venv/
*.pyc
__pycache__/


This should give you the complete flow to start a Python Selenium project from scratch.

`;
