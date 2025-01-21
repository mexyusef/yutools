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

export function register_dir_context_create_desktop_pyqt6(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_desktop_pyqt6`, async (uri: vscode.Uri) => {
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
Here's a step-by-step list of commands and actions to start a Python PyQt6 project from scratch to finish. I have included both command-line instructions and development tasks like editing files.

### 1. **Create a Virtual Environment (Optional but recommended)**
	bash
	python -m venv venv

	- Activate the virtual environment:
	  - **Windows**:
		 bash
		 .\\venv\\Scripts\\activate

	  - **Linux/macOS**:
		 bash
		 source venv/bin/activate


### 2. **Install PyQt6**
	bash
	pip install PyQt6


### 3. **Create Project Directory**
	bash
	mkdir pyqt6_project
	cd pyqt6_project


### 4. **Generate Main Python File**
	bash
	touch main.py


### 5. **Edit main.py File**
	- **<Open and edit main.py in your preferred editor>**: Write basic PyQt6 application code, for example:
	  python
	  import sys
	  from PyQt6.QtWidgets import QApplication, QMainWindow

	  class MainWindow(QMainWindow):
			def __init__(self):
				 super().__init__()
				 self.setWindowTitle("PyQt6 Application")

	  app = QApplication(sys.argv)
	  window = MainWindow()
	  window.show()
	  sys.exit(app.exec())


### 6. **Run the Application**
	bash
	python main.py


### 7. **Edit UI Components (Optional)**
	- **<Modify main.py or create additional UI files>**: Add widgets, layouts, etc., to build the UI.

### 8. **Use Qt Designer for UI (Optional)**
	- **<Download and use Qt Designer>**:
	  - Create .ui files using the graphical interface.
	  - Convert .ui files to Python files (if needed):
		 bash
		 pyuic6 -x input.ui -o output.py


### 9. **Package Your Application (Optional)**
	- If you want to package the application into a standalone executable:
	  bash
	  pip install pyinstaller
	  pyinstaller --onefile main.py


### 10. **Final Testing**
	- **<Run and test the application>**: Ensure everything works properly and make final tweaks.

---

This list should help guide you through the entire process of starting and developing a PyQt6 project.
`;
