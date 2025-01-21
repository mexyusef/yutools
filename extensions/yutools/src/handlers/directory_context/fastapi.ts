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

export function register_dir_context_create_fastapi(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_fastapi`,
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
Here's a step-by-step list of commands and activities to create a FastAPI project from start to finish:

### 1. **Set Up Python Environment**

- **Create and activate a virtual environment** (optional but recommended):
	bash
	python3 -m venv env
	source env/bin/activate      # On macOS/Linux
	env/Scripts/activate         # On Windows


### 2. **Install FastAPI and Uvicorn**

	bash
	pip install fastapi uvicorn


### 3. **Create Project Directory Structure**

- Manually create the project folder and subdirectories, such as app/ or src/.

	bash
	mkdir fastapi_project
	cd fastapi_project
	mkdir app
	touch app/main.py


### 4. **Edit Main File** (app/main.py)

- Manually open and edit app/main.py. Basic example of a FastAPI application:

	python
	from fastapi import FastAPI

	app = FastAPI()

	@app.get("/")
	async def read_root():
		 return {"Hello": "World"}


### 5. **Run the Development Server**

	bash
	uvicorn app.main:app --reload


### 6. **Create Additional Routes** (Optional)

- Edit app/main.py to define more routes or API endpoints. For example:

	python
	@app.get("/items/{item_id}")
	async def read_item(item_id: int, q: str = None):
		 return {"item_id": item_id, "q": q}


### 7. **Install Optional Dependencies (Pydantic, Databases, etc.)**

- Install additional packages as needed:
	bash
	pip install sqlalchemy
	pip install pydantic


### 8. **Set Up Database Connection** (Optional)

- Manually create and edit database models and connection logic in a separate file, e.g., app/models.py.
- Example database setup with SQLAlchemy or Tortoise ORM.

### 9. **Create Unit Tests (Optional)**

- Manually create a tests directory and add tests using the pytest framework.
	bash
	mkdir tests
	touch tests/test_main.py


	Example test (tests/test_main.py):
	python
	from fastapi.testclient import TestClient
	from app.main import app

	client = TestClient(app)

	def test_read_root():
		 response = client.get("/")
		 assert response.status_code == 200
		 assert response.json() == {"Hello": "World"}


### 10. **Run Tests**

	bash
	pytest


### 11. **Dockerize the Application (Optional)**

- Create a Dockerfile (if desired):
	dockerfile
	FROM python:3.9
	WORKDIR /app
	COPY . /app
	RUN pip install -r requirements.txt
	CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]


### 12. **Build and Run Docker Image (Optional)**

	bash
	docker build -t fastapi_project .
	docker run -d -p 80:80 fastapi_project


### 13. **Deploy the Application** (Optional)

- Deploy to a cloud provider (AWS, Heroku, etc.).

### 14. **Stop the Development Server**

	bash
	# Simply hit CTRL+C in the terminal or:
	pkill uvicorn   # Stops uvicorn on UNIX systems


This sequence will guide you from project setup to deployment.

`;
