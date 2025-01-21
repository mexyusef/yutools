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
		main.dart,f(e=C:\\ai\\fulled\\extensions\\fulled\\src\\commands\\directory_context\\apache_airflow.ts=BACA.md)
`;

export function register_dir_context_create_apache_airflow(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_apache_airflow`,
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
Here’s a list of commands and actions to start a Python project and set up Apache Airflow, from start to finish:

### 1. **Set up Python Project:**

	**Create Project Directory**:
	bash
	mkdir my_project
	cd my_project


	**Create a Virtual Environment**:
	bash
	python3 -m venv venv
	source venv/bin/activate  # For Linux/Mac
	venv\\Scripts\\activate     # For Windows


	**Install Required Dependencies**:
	bash
	pip install apache-airflow


	**Freeze Dependencies**:
	bash
	pip freeze > requirements.txt


	**Create Main Python File (or DAG File)**:
	- *Action*: Create a Python file (e.g., main.py, my_dag.py).

	**Editing Main File**:
	- *Action*: Write necessary code in main.py or DAG logic in my_dag.py.

### 2. **Initialize Apache Airflow**:

	**Set Up Airflow Home Directory**:
	bash
	export AIRFLOW_HOME=~/airflow  # or set in your shell config file


	**Install Airflow and Initialize Database**:
	bash
	airflow db init


### 3. **Configure Airflow:**

	**Editing airflow.cfg File**:
	- *Action*: Update airflow.cfg settings (e.g., for connections, execution time, etc.).

	**Create User for Airflow**:
	bash
	airflow users create \
		--username admin \
		--password admin \
		--firstname FIRST_NAME \
		--lastname LAST_NAME \
		--role Admin \
		--email admin@example.com


### 4. **Run Airflow Components**:

	**Start Airflow Scheduler**:
	bash
	airflow scheduler


	**Start Airflow Webserver**:
	bash
	airflow webserver --port 8080


	**Open Airflow UI**:
	- *Action*: Open a browser and go to http://localhost:8080.

### 5. **Develop and Run DAGs:**

	**Editing DAG File**:
	- *Action*: Write DAG logic in my_dag.py inside the dags folder.

	**Place DAGs in the Airflow DAG Directory**:
	bash
	mv my_dag.py $AIRFLOW_HOME/dags/


	**Trigger DAG Manually**:
	bash
	airflow dags trigger my_dag


	**Check DAG Status**:
	bash
	airflow dags list
	airflow tasks list my_dag
	airflow tasks test my_dag task_id execution_date


### 6. **(Optional) Use Airflow with Docker:**

	**Create docker-compose.yml**:
	- *Action*: Write a docker-compose.yml file to define services for Airflow.

	**Run Airflow Using Docker**:
	bash
	docker-compose up -d


### 7. **Monitor and Debug:**

	**View Logs**:
	bash
	airflow tasks logs my_dag task_id execution_date


	**Check Scheduler/Worker Logs**:
	bash
	tail -f $AIRFLOW_HOME/logs/scheduler/*  # Or worker logs


### 8. **Shutdown Airflow**:

	**Stop Webserver and Scheduler**:
	bash
	pkill -f "airflow webserver"
	pkill -f "airflow scheduler"


This is a high-level overview, covering the main steps involved in setting up a Python project and integrating Apache Airflow from scratch.

`;
