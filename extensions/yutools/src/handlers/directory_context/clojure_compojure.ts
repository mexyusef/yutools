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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\clojure_compojure.ts=BACA.md)
`;

export function register_dir_context_create_clojure_compojure(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_clojure_compojure`,
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
		}
	);
	context.subscriptions.push(disposable);
}


const information = `
Here's a step-by-step guide to starting a Clojure project using Compojure from start to finish, including commands and key activities that you need to perform during the development process:

### 1. **Install Leiningen** (if you haven't already)
Leiningen is a build automation tool used for Clojure projects.

- Follow installation instructions here: [Leiningen](https://leiningen.org/)

### 2. **Create a New Leiningen Project**

bash
lein new compojure my-compojure-app


This command generates a new Clojure project using the Compojure template. It creates a project directory called my-compojure-app with all necessary files.

### 3. **Navigate to Your Project Directory**

bash
cd my-compojure-app


### 4. **Add Dependencies in project.clj** (optional)
If you need to add more dependencies like middleware or specific libraries, edit the project.clj file.

- Add/edit dependencies like Ring, Compojure, etc., in the :dependencies section.

Example snippet from project.clj:

clojure
:dependencies [[org.clojure/clojure "1.10.1"]
							 [compojure "1.6.1"]
							 [ring/ring-defaults "0.3.2"]]


### 5. **Edit Main File (Activity)**

- Navigate to src/my_compojure_app/handler.clj and modify it.
- Define your routes using Compojure.

Example of editing handler.clj:

clojure
(ns my-compojure-app.handler
	(:require [compojure.core :refer :all]
						[compojure.route :as route]
						[ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(defroutes app-routes
	(GET "/" [] "Hello World")
	(route/not-found "Page not found"))

(def app
	(wrap-defaults app-routes site-defaults))


### 6. **Run the Development Server**

bash
lein ring server


This command runs the project using an embedded Jetty server, and it serves your web app on http://localhost:3000.

### 7. **Testing and Debugging** (Optional)

- Add unit tests for your routes by editing files in the test directory.
- Run tests with Leiningen:

bash
lein test


### 8. **Edit Routes / Views (Activity)**

- Continue editing the handler.clj file or other files for routes and views.
- If you're using templates like Selmer for HTML, include them in the :dependencies and integrate them into your routes.

### 9. **Run Server in Production Mode**

If you want to run the server in production mode without auto-reloading, you can use:

bash
lein ring uberjar
java -jar target/my-compojure-app-standalone.jar


This builds a standalone .jar file and runs the application from it.

### 10. **Deploying to Production**

- For production deployment, configure a web server like Nginx or Heroku to host the application.
- Optionally, use Docker, if necessary.

### Summary of Commands and Key Steps:

1. **Install Leiningen**: brew install leiningen (or equivalent)
2. **Create Project**: lein new compojure my-compojure-app
3. **Navigate to Project Directory**: cd my-compojure-app
4. **Edit Dependencies in project.clj** (Activity)
5. **Edit Main File handler.clj** (Activity)
6. **Run Server**: lein ring server
7. **Testing**: lein test (Optional)
8. **Run Production Build**: lein ring uberjar, java -jar target/my-compojure-app-standalone.jar
9. **Deploy to Production** (Activity)

That’s a complete flow from start to finish!
`;
