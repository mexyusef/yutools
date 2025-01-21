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

export function register_dir_context_create_flask(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_flask`,
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
Here’s a step-by-step guide to creating a Flask project, from start to finish, including key commands and activities:

1. **Set up a Python environment**
	 Create a virtual environment for your project to isolate dependencies:
	 bash
	 python3 -m venv venv


2. **Activate the virtual environment**
	 - On macOS/Linux:
		 bash
		 source venv/bin/activate

	 - On Windows:
		 bash
		 venv/Scripts/activate


3. **Install Flask**
	 Install Flask in your virtual environment:
	 bash
	 pip install Flask


4. **Create a project directory**
	 Create the folder structure for your Flask app:
	 bash
	 mkdir my_flask_app
	 cd my_flask_app


5. **Create the main Flask app file**
	 - Create a Python file named app.py in your project folder:
	 bash
	 touch app.py


6. **Edit the main file (app.py)**
	 - Open app.py and add the following basic code to start your Flask application:
		 python
		 from flask import Flask

		 app = Flask(__name__)

		 @app.route('/')
		 def hello():
				 return "Hello, World!"

		 if __name__ == '__main__':
				 app.run(debug=True)


7. **Set the Flask environment variables (optional)**
	 - You can set environment variables to define the application and enable debug mode:
		 bash
		 export FLASK_APP=app.py
		 export FLASK_ENV=development

	 On Windows (PowerShell):
	 bash
	 $env:FLASK_APP="app.py"
	 $env:FLASK_ENV="development"


8. **Run the Flask app**
	 Start the Flask development server:
	 bash
	 flask run


9. **Create templates folder (for HTML files)**
	 - To use HTML templates, create a templates folder:
		 bash
		 mkdir templates
		 touch templates/index.html


10. **Edit HTML template (index.html)**
		- Open index.html and add your HTML content:
			html
			<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Flask App</title>
			</head>
			<body>
					<h1>Welcome to Flask</h1>
			</body>
			</html>


11. **Edit routes to use templates (in app.py)**
		- Modify your route to render the HTML template:
			python
			from flask import Flask, render_template

			app = Flask(__name__)

			@app.route('/')
			def home():
					return render_template('index.html')

			if __name__ == '__main__':
					app.run(debug=True)


12. **Create static folder (for CSS, JS, etc.)**
		- For static files (e.g., CSS, JS), create a static folder:
			bash
			mkdir static
			touch static/style.css


13. **Edit static file (style.css)**
		- Open style.css and add some styles:
			css
			body {
					font-family: Arial, sans-serif;
			}


14. **Connect the static file in your HTML template**
		- Add the following line to your index.html to link the CSS file:
			html
			<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">


15. **Testing and Debugging**
		- Test your app in the browser, access http://127.0.0.1:5000/, and verify everything works as expected.

16. **Deactivating the virtual environment**
		- When you're done, deactivate your virtual environment:
			bash
			deactivate


---

This list includes the critical commands and the necessary activities to develop and run a basic Flask project.

`;
