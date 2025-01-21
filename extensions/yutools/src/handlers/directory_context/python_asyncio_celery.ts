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

export function register_dir_context_create_python_asyncio_celery(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_asyncio_celery`,
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
To start a Python project using both asyncio and Celery, follow this step-by-step guide that includes commands as well as activities you need to perform during the development process:

### 1. **Set up the Python environment**

bash
# Create a virtual environment (optional, but recommended)
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate

# Upgrade pip to ensure you have the latest version
pip install --upgrade pip


### 2. **Install the required dependencies**

bash
# Install asyncio (comes with Python 3.7+ but can be updated) and Celery
pip install asyncio celery[redis]  # Redis is commonly used as a broker for Celery

# If you need a Redis server for Celery, install Redis server or run it with Docker


### 3. **Set up Redis (Celery broker)**

- **Option 1: Install Redis locally**
	On macOS using Homebrew:
	bash
	brew install redis
	brew services start redis

	On Ubuntu:
	bash
	sudo apt-get install redis-server
	sudo systemctl start redis-server


- **Option 2: Run Redis using Docker**
	bash
	docker run -d -p 6379:6379 redis


### 4. **Set up project structure**

bash
# Create the project directory and navigate into it
mkdir celery_asyncio_project
cd celery_asyncio_project

# Create the main project files
touch app.py  # Main application file
touch celery_tasks.py  # Celery tasks definition file
touch asyncio_tasks.py  # Asyncio tasks definition file
touch celeryconfig.py  # Celery configuration file (optional)


### 5. **<Editing main project files>**

- **In celeryconfig.py (Celery configuration):**
	python
	broker_url = 'redis://localhost:6379/0'
	result_backend = 'redis://localhost:6379/0'


- **In celery_tasks.py (Define Celery tasks):**
	python
	from celery import Celery

	app = Celery('celery_tasks')
	app.config_from_object('celeryconfig')

	@app.task
	def add(x, y):
			return x + y


- **In asyncio_tasks.py (Define asyncio tasks):**
	python
	import asyncio

	async def print_numbers():
			for i in range(1, 6):
					print(i)
					await asyncio.sleep(1)

	async def main():
			print("Asyncio task started")
			await print_numbers()
			print("Asyncio task completed")

	if __name__ == '__main__':
			asyncio.run(main())


- **In app.py (Main entry point for both Celery and asyncio):**
	python
	from celery_tasks import add
	import asyncio
	from asyncio_tasks import main as asyncio_main

	if __name__ == '__main__':
			# Run an example asyncio task
			asyncio.run(asyncio_main())

			# Queue an example Celery task
			result = add.delay(3, 5)
			print(f"Celery task result: {result.get(timeout=10)}")


### 6. **Run Celery worker**

bash
# Start the Celery worker (with Redis broker)
celery -A celery_tasks worker --loglevel=info


### 7. **Run the asyncio program**

bash
# Run the asyncio program
python asyncio_tasks.py


### 8. **Run the main app**

bash
# Run the main application which integrates both Celery and asyncio
python app.py


### 9. **Testing and debugging**

- Monitor the Celery worker for task status.
- Ensure Redis is running properly.
- Make sure asyncio tasks are performing as expected by adjusting asyncio_tasks.py.

---

This outline provides you with a clear step-by-step process to set up a Python project using asyncio and Celery, including commands and development tasks.
`;
