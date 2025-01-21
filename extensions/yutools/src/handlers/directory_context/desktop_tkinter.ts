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

export function register_dir_context_create_desktop_tkinter(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_desktop_tkinter`,
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
Here’s a step-by-step guide to starting a Python Tkinter project from start to finish, including the necessary commands and key activities during development:

### 1. **Create a Project Directory**
	Create a new directory for your project to keep everything organized.

	bash
	mkdir tkinter_project
	cd tkinter_project


### 2. **Create a Virtual Environment (Optional but recommended)**
	To keep dependencies isolated, create and activate a virtual environment.

	**For Windows:**
	bash
	python -m venv venv
	venv\\Scripts\\activate


	**For macOS/Linux:**
	bash
	python3 -m venv venv
	source venv/bin/activate


### 3. **Install Tkinter (Optional on some systems)**
	Tkinter usually comes pre-installed with Python. But if you don't have it installed, or to ensure it works well on your system:

	**For Ubuntu:**
	bash
	sudo apt-get install python3-tk


	**For macOS (with Homebrew):**
	bash
	brew install python-tk


### 4. **Create the Main Python File**
	Create your main Python file where you'll start writing the Tkinter code.

	bash
	touch main.py


### 5. **Edit the Main File (main.py)**
	Open the main.py file in your favorite editor and write the Tkinter code. Here's a sample basic code to get started:

	python
	import tkinter as tk

	# Create the main window
	root = tk.Tk()
	root.title("My Tkinter App")
	root.geometry("300x200")

	# Create a label
	label = tk.Label(root, text="Hello, Tkinter!")
	label.pack(pady=20)

	# Start the Tkinter event loop
	root.mainloop()


	**Example CLI commands to open the file in a text editor:**

	**For VS Code:**
	bash
	code main.py


	**For Nano:**
	bash
	nano main.py


	**For Sublime Text:**
	bash
	subl main.py


### 6. **Run the Tkinter Project**
	Once you've added your code, run the program to see your Tkinter window.

	bash
	python main.py


### 7. **Edit the Main File Again to Add More Features**
	Continue editing main.py to add more widgets (buttons, text boxes, etc.) and functionality as per your project requirements.

### 8. **Save and Run the Updated Code**
	After each round of edits, save the file and run the program again to test the changes.

	bash
	python main.py


### 9. **Package the Project (Optional)**
	If you want to distribute your project, you can package it as an executable using PyInstaller.

	bash
	pip install pyinstaller
	pyinstaller --onefile main.py


	This will create a standalone executable in the dist folder.

### 10. **Deactivate Virtual Environment (Optional)**
	When you're done with development, deactivate the virtual environment.

	bash
	deactivate


### 11. **Version Control (Optional but recommended)**
	Initialize Git for version control and push to a repository like GitHub.

	bash
	git init
	git add .
	git commit -m "Initial commit"
	git remote add origin <your-repo-url>
	git push -u origin master


---

With these steps, you should be able to start and complete a Tkinter project. The process involves setting up your environment, writing and editing the main Tkinter code, running the application, and packaging it if needed.
`;
