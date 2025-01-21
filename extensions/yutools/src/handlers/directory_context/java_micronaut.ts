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

export function register_dir_context_create_java_micronaut(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_micronaut`,
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
To start a modern Java project with Micronaut from scratch, follow these steps, including CLI commands and development activities like editing files.

### 1. **Install Java & Micronaut CLI** (if not already installed)
	Ensure you have Java (version 17 or later) installed. Then, install the Micronaut CLI if it's not installed.

	**Install Micronaut CLI**:
	bash
	sdk install micronaut


### 2. **Create Micronaut Project**
	Use the Micronaut CLI to create a new project. Choose --build=maven or --build=gradle depending on the build tool you prefer.

	**Command**:
	bash
	mn create-app com.example.myapp --build=maven --features=java


### 3. **Navigate to the Project Directory**:
	**Command**:
	bash
	cd myapp


### 4. **Edit the Main Application File**
	By default, Micronaut creates an entry point in src/main/java/com/example/myapp/Application.java. You might want to configure it to fit your needs.

	**Edit file**:
	java
	package com.example.myapp;

	import io.micronaut.runtime.Micronaut;

	public class Application {

		 public static void main(String[] args) {
			  Micronaut.run(Application.class, args);
		 }
	}


### 5. **Add Controllers**
	Create a new controller to handle your application endpoints. This is an example using a basic HelloController.

	**Command**:
	bash
	mn create-controller hello


	**Edit the controller file**:
	java
	package com.example.myapp.controllers;

	import io.micronaut.http.annotation.Controller;
	import io.micronaut.http.annotation.Get;

	@Controller("/hello")
	public class HelloController {

		 @Get("/")
		 public String index() {
			  return "Hello Micronaut!";
		 }
	}


### 6. **Edit Application Configuration (Optional)**
	If you need to configure the application, edit src/main/resources/application.yml.

	**Edit file**:
	yaml
	micronaut:
	  application:
		 name: myapp


### 7. **Run the Application**
	Start the application using Maven or Gradle.

	**Command (for Maven)**:
	bash
	./mvnw mn:run


	**Command (for Gradle)**:
	bash
	./gradlew run


### 8. **Testing the Application**
	After running the application, you can access the API (e.g., the /hello endpoint) via the browser or any API client:

	**URL**:

	http://localhost:8080/hello


### 9. **Run Tests**
	Micronaut generates test templates. You can run the tests with your chosen build tool.

	**Command (for Maven)**:
	bash
	./mvnw test


	**Command (for Gradle)**:
	bash
	./gradlew test


### 10. **Build the Application**
	Once you’re ready to package the application, you can build it using Maven or Gradle.

	**Command (for Maven)**:
	bash
	./mvnw package


	**Command (for Gradle)**:
	bash
	./gradlew assemble


### 11. **Run the Built Application**
	After packaging the app, you can run the generated JAR.

	**Command**:
	bash
	java -jar target/myapp-0.1.jar  # for Maven build
	java -jar build/libs/myapp-0.1.jar  # for Gradle build


### 12. **Optional: Deploy to Cloud**
	You can deploy the Micronaut application to platforms like Heroku, AWS Lambda, or Kubernetes.

	- Follow the respective cloud provider's documentation for deployment.

---

This sequence of commands and activities will guide you through creating, developing, testing, building, and running a Micronaut application with Java.
`;
