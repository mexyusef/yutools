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

export function register_dir_context_create_devops_kubernetes(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_devops_kubernetes`, async (uri: vscode.Uri) => {
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
Here's a comprehensive list of commands and activities that you would typically perform when starting a project with Docker and GitHub Actions from start to finish.

### 1. **Initialize a GitHub Repository**

- **Activity:** Create a new repository on GitHub (manual step).
- Clone the repository:
	bash
	git clone <repo-url>
	cd <repo-folder>


### 2. **Set Up Docker**

- Create a Dockerfile:
	bash
	touch Dockerfile


- **Edit the Dockerfile** (activity):
  - Specify base image, install dependencies, copy project files, expose ports, and define CMD.

  Example content for a simple Node.js project:
  dockerfile
  FROM node:14
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  EXPOSE 3000
  CMD ["npm", "start"]


- Build Docker image:
	bash
	docker build -t <your-image-name> .


- Run Docker container:
	bash
	docker run -d -p 3000:3000 <your-image-name>


- Check running containers:
	bash
	docker ps


### 3. **Create docker-compose.yml (Optional)**

- Create docker-compose.yml file:
	bash
	touch docker-compose.yml


- **Edit the docker-compose.yml file** (activity):
  Example content:
  yaml
  version: '3'
  services:
	 app:
		build: .
		ports:
		  - "3000:3000"
		volumes:
		  - .:/app


- Run using Docker Compose:
	bash
	docker-compose up -d


### 4. **Set Up GitHub Actions**

- **Activity:** Create a .github/workflows/ directory.
	bash
	mkdir -p .github/workflows


- Create a workflow YAML file:
	bash
	touch .github/workflows/ci.yml


- **Edit the workflow YAML file** (activity):
  Example content for a Node.js project:
  yaml
  name: CI

  on:
	 push:
		branches:
		  - main
	 pull_request:
		branches:
		  - main

  jobs:
	 build:
		runs-on: ubuntu-latest

		steps:
		  - uses: actions/checkout@v2
		  - name: Set up Node.js
			 uses: actions/setup-node@v2
			 with:
				node-version: '14'
		  - run: npm install
		  - run: npm test


- Commit the changes:
	bash
	git add .
	git commit -m "Initial Docker and GitHub Actions setup"


- Push to GitHub:
	bash
	git push origin main


### 5. **Testing the Setup**

- After pushing the code, GitHub Actions will automatically start. You can monitor the progress under the "Actions" tab on GitHub (manual step).
- Locally, ensure everything is working by running:
	bash
	docker-compose up --build


### 6. **Update and Iterate**

- **Activity:** Continue editing project files like your source code, tests, or configuration.
- Rebuild Docker image when changes are made:
	bash
	docker-compose up --build


- **Activity:** Update GitHub Actions workflows if necessary, such as adding more jobs or adjusting environments.

### 7. **Clean Up**

- Stop Docker containers:
	bash
	docker-compose down


- Remove unused Docker images:
	bash
	docker system prune


### Summary of Key Commands:
1. git clone <repo-url> && cd <repo-folder>
2. touch Dockerfile
3. docker build -t <your-image-name> .
4. docker run -d -p 3000:3000 <your-image-name>
5. mkdir -p .github/workflows
6. touch .github/workflows/ci.yml
7. git add . && git commit -m "Initial setup"
8. git push origin main
9. docker-compose up --build
10. docker-compose down

Let me know if you need more details on any step!
`;
