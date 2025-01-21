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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\deno.ts=BACA.md)
`;

export function register_dir_context_create_deno(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_deno`,
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
Here’s a complete step-by-step guide, including commands and tasks, to start a **Deno TypeScript project** from scratch to finish:

1. **Install Deno (if not installed already)**
	 - Visit the official website and follow installation instructions for your OS: https://deno.land/#installation
	 - Alternatively, using Shell:
		 bash
		 curl -fsSL https://deno.land/x/install/install.sh | sh


2. **Verify Deno installation**
	 bash
	 deno --version


3. **Create a new directory for the project**
	 bash
	 mkdir my-deno-project
	 cd my-deno-project


4. **Initialize Git repository (optional)**
	 bash
	 git init


5. **Create main.ts (main entry file)**
	 bash
	 touch main.ts


6. **Edit the main.ts file**
	 - Open the file in a code editor (e.g., VSCode) and write a simple Deno program, such as:

	 typescript
	 console.log("Hello, Deno!");


7. **Run the TypeScript file using Deno**
	 bash
	 deno run main.ts


8. **Use a third-party module (optional)**
	 - Import modules from Deno’s third-party registry like:

	 typescript
	 import { serve } from "https://deno.land/std@0.107.0/http/server.ts";

	 const server = serve({ port: 8000 });
	 console.log("Server is running on http://localhost:8000");

	 for await (const req of server) {
		 req.respond({ body: "Hello, Deno Server!" });
	 }


	 - Run it:
		 bash
		 deno run --allow-net main.ts


9. **Edit deno.json (optional but recommended for project configuration)**
	 - Create deno.json to manage project settings such as import maps or type checking. Example:

	 json
	 {
		 "compilerOptions": {
			 "lib": ["dom", "esnext"]
		 },
		 "tasks": {
			 "start": "deno run --allow-net main.ts"
		 }
	 }


10. **Install dependencies via import map (optional)**
		- Create import_map.json for better import management:

		json
		{
			"imports": {
				"http/": "https://deno.land/std@0.107.0/http/"
			}
		}


		- Update main.ts to use the import map:

		typescript
		import { serve } from "http/server.ts";


		- Run with the import map:
			bash
			deno run --import-map=import_map.json --allow-net main.ts


11. **Run with formatting and linting (optional)**
		- Format your code:
			bash
			deno fmt


		- Lint your code:
			bash
			deno lint


12. **Run tests (optional)**
		- Write tests in tests.ts:

		typescript
		import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

		Deno.test("example test", () => {
			assertEquals(1 + 1, 2);
		});


		- Run the tests:
			bash
			deno test


13. **Build or bundle the project (optional for deployment)**
		- Bundle the project into a single file:

		bash
		deno bundle main.ts bundle.js


14. **Deploy the project (optional)**
		- You can use **Deno Deploy** or any hosting provider to deploy your application.

---

These are the general steps, including the commands, to build a Deno TypeScript project from scratch!
`;
