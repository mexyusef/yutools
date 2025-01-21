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

export function register_dir_context_create_node_fastify(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_node_fastify`,
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
Here's a step-by-step guide, including both commands and development activities, to start a Node.js + TypeScript + Fastify project from scratch:

### 1. **Initialize Node.js Project**
bash
mkdir my-fastify-app
cd my-fastify-app
npm init -y


### 2. **Install TypeScript & Fastify**
bash
npm install fastify
npm install typescript ts-node @types/node --save-dev


### 3. **Set Up TypeScript Configuration**
bash
npx tsc --init


This creates a tsconfig.json file. You may need to tweak it for Fastify development. For example, ensure these fields are set:
json
{
	"compilerOptions": {
		"target": "ES6",
		"module": "commonjs",
		"outDir": "./dist",
		"rootDir": "./src",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	"include": ["src/**/*"]
}


### 4. **Set Up Project Directory Structure**
bash
mkdir src
touch src/server.ts


### 5. **Edit server.ts (Main File)**

Write your basic Fastify server setup in src/server.ts:

typescript
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
		console.log('Server is running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();


### 6. **Install Type Definitions for Fastify**
bash
npm install @types/fastify --save-dev


### 7. **Install ts-node-dev for Development**
bash
npm install ts-node-dev --save-dev


This will help with automatic server restarts during development.

### 8. **Edit package.json to Add Scripts**

Add the following script under "scripts" in package.json:

json
"scripts": {
	"dev": "ts-node-dev --respawn src/server.ts",
	"build": "tsc",
	"start": "node dist/server.js"
}


### 9. **Run the Development Server**
bash
npm run dev


At this point, your Fastify server will be running, and you can visit it at http://localhost:3000.

### 10. **Build the Project for Production**
bash
npm run build


### 11. **Start the Production Server**
bash
npm start


Now you have a full workflow from project setup to running both a development and production server for a Node.js + TypeScript + Fastify project.
`;
