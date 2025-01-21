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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\clojure_luminus.ts=BACA.md)
`;

export function register_dir_context_create_clojure_luminus(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_clojure_luminus`, async (uri: vscode.Uri) => {
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
Here's a step-by-step list of commands and activities to start a Clojure Luminus project from start to finish:

### 1. Install Leiningen (if not installed)
	Luminus uses Leiningen as a build tool, so make sure it's installed.

	**Command**:
	bash
	brew install leiningen   # For macOS users
	apt-get install leiningen # For Debian-based Linux


### 2. Create a new Luminus project
	**Command**:
	bash
	lein new luminus <project-name> +sqlite +shadow-cljs +reagent

	*(You can replace +sqlite or +reagent with different profiles if needed)*

### 3. Change directory into the project folder
	**Command**:
	bash
	cd <project-name>


### 4. Initialize the project (download dependencies)
	**Command**:
	bash
	lein run


### 5. Edit the profiles.clj (optional for environment setup)
	**Activity**:
	Open the profiles.clj file and configure settings for dev, prod, and other environments if necessary.

### 6. Set up the database schema (SQLite example)
	**Activity**:
	Open the resources/sql/migrations folder and create SQL migration files.

	Alternatively, you can use a tool like [migratus](https://github.com/yogthos/migratus) for database migrations.

### 7. Apply migrations to the database
	**Command**:
	bash
	lein run migrate


### 8. Run the development server
	**Command**:
	bash
	lein run


	This will start the server, typically on localhost:3000.

### 9. Edit the main application logic
	**Activity**:
	Edit the Clojure files in the src/<project-name> directory, particularly handler.clj (for routing), core.clj, and other namespaces as needed.

### 10. Configure frontend with Reagent (if using Shadow CLJS)
	**Activity**:
	Edit the files in src/cljs/<project-name> for any frontend logic. Shadow CLJS will handle Reagent-based ClojureScript code.

### 11. Run Shadow CLJS to compile frontend code
	**Command**:
	bash
	npx shadow-cljs watch app


	*(Make sure you have npm installed to run this command.)*

### 12. Test the project
	**Command**:
	bash
	lein test


### 13. Package the application for production
	**Command**:
	bash
	lein uberjar


	This will create a standalone JAR file in the target/uberjar folder.

### 14. Run the production JAR file
	**Command**:
	bash
	java -jar target/uberjar/<project-name>-standalone.jar


### 15. Deploy to your preferred environment (optional)
	**Activity**:
	Set up your hosting, environment variables, and deploy the JAR file to your preferred server (Heroku, AWS, DigitalOcean, etc.).

This should guide you through the entire process of starting and setting up a Luminus project. Let me know if you need further clarification on any steps!

`;
