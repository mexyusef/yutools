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

export function register_dir_context_create_openapi_swagger(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_openapi_swagger`,
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
Here’s a step-by-step guide with both CLI commands and key development tasks to start a new OpenAPI/Swagger project from scratch to completion:

### 1. **Initialize Project**
bash
# Create a new project directory
mkdir my-openapi-project
cd my-openapi-project

# Initialize Node.js project (if using JavaScript/TypeScript)
npm init -y


### 2. **Install Swagger/OpenAPI Tools**
bash
# Install Swagger/OpenAPI tools for generating the documentation
npm install swagger-jsdoc swagger-ui-express --save

# Alternatively, if you're using a framework like Fastify:
npm install fastify-swagger --save

# If you prefer using the OpenAPI Generator:
npm install @openapitools/openapi-generator-cli --save-dev


### 3. **Create/OpenAPI Specification (YAML/JSON)**
1. **Create OpenAPI Specification file** (e.g., openapi.yaml or openapi.json).
2. **Edit OpenAPI specification file** to define endpoints, request/response models, etc.

	 Example for openapi.yaml:
	 yaml
	 openapi: 3.0.0
	 info:
		 title: Sample API
		 version: 1.0.0
	 paths:
		 /example:
			 get:
				 summary: Sample endpoint
				 responses:
					 '200':
						 description: Success


### 4. **Set Up API Server (Node.js/Express Example)**
bash
# Install Express
npm install express --save


#### **Editing main server file (e.g., app.js):**
1. **Set up basic Express server**:
	 javascript
	 const express = require('express');
	 const app = express();

	 app.get('/example', (req, res) => {
		 res.send('Sample response');
	 });

	 app.listen(3000, () => {
		 console.log('Server is running on port 3000');
	 });


2. **Add Swagger UI integration (e.g., app.js):**
	 javascript
	 const swaggerUi = require('swagger-ui-express');
	 const swaggerDocument = require('./openapi.json'); // or 'openapi.yaml'

	 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


### 5. **Test API Locally**
bash
# Start the server
node app.js

# Open browser to view Swagger docs
http://localhost:3000/api-docs


### 6. **Generate API Clients/Server Stubs (Optional)**
If you're using the OpenAPI Generator CLI, you can generate API clients or server stubs for multiple languages.

bash
npx openapi-generator-cli generate -i openapi.yaml -g <language> -o ./generated
# Example: Generate a Node.js client
npx openapi-generator-cli generate -i openapi.yaml -g javascript -o ./generated


### 7. **Version Control**
bash
# Initialize Git
git init

# Create a .gitignore file (add node_modules, etc.)
echo "node_modules" >> .gitignore

# Commit the initial project
git add .
git commit -m "Initial OpenAPI project setup"


### 8. **Deployment (Optional)**
bash
# Example: Deploy to Heroku (if using Heroku)
heroku create
git push heroku master


### 9. **Ongoing Development**
1. **Edit API routes** (e.g., in app.js) to build out more complex functionality.
2. **Update OpenAPI documentation** (in openapi.yaml or openapi.json) as the API evolves.
3. **Run tests** to ensure correctness, e.g., with Jest or Mocha.

`;
