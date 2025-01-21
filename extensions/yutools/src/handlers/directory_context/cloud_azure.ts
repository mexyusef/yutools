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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\cloud_azure.ts=BACA.md)
`;

export function register_dir_context_create_cloud_azure(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_cloud_azure`, async (uri: vscode.Uri) => {
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
Here’s a general workflow for starting an Azure CLI project from scratch, including the necessary commands and non-CLI steps like editing files. This assumes you're building a basic project (e.g., a web app or function) and interacting with Azure resources.

### 1. **Install and Configure Azure CLI**
	- Install Azure CLI (if not already installed):
	  Follow instructions here: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
	- Sign in to Azure:
	  bash
	  az login


### 2. **Create a Resource Group**
	Azure resources must exist in a resource group.
	bash
	az group create --name <your-resource-group-name> --location <region>


### 3. **Create a Project Directory and Initialize Codebase**
	Create a directory for your project.
	bash
	mkdir <project-directory>
	cd <project-directory>


### 4. **Initialize a Git Repository (Optional)**
	bash
	git init


### 5. **Choose Your Development Framework**
	Depending on your project (e.g., Node.js, Python, etc.), you may need to initialize a project with the respective commands.

	- For Node.js:
	  bash
	  npm init


	- For Python:
	  bash
	  pip install virtualenv
	  virtualenv venv
	  source venv/bin/activate


### 6. **Create and Edit Your Main File**
	Open and edit your application code, such as creating an app.js or main.py. (No CLI command here, but an important development step.)

	- Example:
	  - **Node.js (app.js)**:
		 javascript
		 const http = require('http');

		 const server = http.createServer((req, res) => {
			  res.statusCode = 200;
			  res.setHeader('Content-Type', 'text/plain');
			  res.end('Hello, World!\n');
		 });

		 server.listen(3000, () => {
			  console.log('Server running at http://localhost:3000/');
		 });


	- **Python (main.py)**:
	  python
	  from flask import Flask
	  app = Flask(__name__)

	  @app.route('/')
	  def hello_world():
			return 'Hello, World!'

	  if __name__ == '__main__':
			app.run(debug=True)


### 7. **Create Azure App Service Plan (For Web Apps)**
	This is necessary to host web apps on Azure.
	bash
	az appservice plan create --name <app-service-plan-name> --resource-group <your-resource-group> --sku FREE


### 8. **Create the Web App**
	bash
	az webapp create --resource-group <your-resource-group> --plan <app-service-plan-name> --name <your-app-name> --runtime "NODE|14-lts"

	Replace NODE|14-lts with your desired runtime (Node.js, Python, .NET, etc.).

### 9. **Deploy Your Application to Azure**
	- Zip your project files for deployment:
	  bash
	  zip -r app.zip *


	- Deploy the app to Azure:
	  bash
	  az webapp deployment source config-zip --resource-group <your-resource-group> --name <your-app-name> --src app.zip


### 10. **Set Up Continuous Deployment (Optional)**
	- Connect your app to a GitHub repository or similar for automated deployment.
	bash
	az webapp deployment source config --name <your-app-name> --resource-group <your-resource-group> --repo-url <your-repo-url> --branch <branch> --manual-integration


### 11. **Monitor and View Logs**
	- View live log stream:
	  bash
	  az webapp log tail --name <your-app-name> --resource-group <your-resource-group>


	- Enable logging if it's not already enabled:
	  bash
	  az webapp log config --name <your-app-name> --resource-group <your-resource-group> --application-logging true


### 12. **Access Your Web App**
	After deployment, you can access your web app via the provided URL:

	https://<your-app-name>.azurewebsites.net


### 13. **Scale Your App (Optional)**
	If needed, you can scale your app to a different pricing tier:
	bash
	az appservice plan update --name <app-service-plan-name> --resource-group <your-resource-group> --sku S1


### 14. **Clean Up Resources (Optional)**
	To avoid charges, delete the resource group when you're done:
	bash
	az group delete --name <your-resource-group>


This workflow covers the essential commands and non-CLI activities needed to start a cloud project using Azure CLI, from setting up the environment to deploying the application.
`;


// give me list of commands that i will invoke to start a cloud Azure cli project from start to finish, including saying like <editing main file> because it's not really a CLI command, but an activity that should be performed during development process
