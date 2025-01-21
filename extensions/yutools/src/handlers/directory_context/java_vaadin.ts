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

export function register_dir_context_create_java_vaadin(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_vaadin`,
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
Here’s a list of commands and activities to start and develop a modern Java Vaadin project:

### 1. **Create a New Vaadin Project**
bash
mvn -N io.takari:maven:wrapper
./mvnw -Pproduction -B com.vaadin:vaadin-archetype-application -DgroupId=com.example -DartifactId=myapp

This command sets up a Maven project using the Vaadin application archetype.

### 2. **Navigate to Project Directory**
bash
cd myapp


### 3. **Edit pom.xml (if needed)**
Make sure to update versions and dependencies for Vaadin or other libraries as needed.

### 4. **Build and Run the Project**
bash
./mvnw clean install
./mvnw spring-boot:run

This will build and start the Vaadin app using Spring Boot.

### 5. **Open the Project in an IDE (e.g., IntelliJ IDEA)**
Here, open the project for further development and editing.

### 6. **Edit MainView.java or Other View Files**
Edit the UI components and logic in Java, particularly in MainView.java, or create new view files as required.

### 7. **Create a New Vaadin Component (optional)**
bash
touch src/main/java/com/example/views/NewComponent.java

Define new UI components or layouts for the application.

### 8. **Add CSS/JS Files (optional)**
Add custom styles or scripts to frontend/styles or other directories in the project.

### 9. **Install Frontend Dependencies (if needed)**
bash
./mvnw vaadin:build-frontend

This ensures Vaadin’s frontend (Webpack, etc.) is properly built.

### 10. **Watch for Changes**
bash
./mvnw spring-boot:run -Dspring-boot.run.fork=false

This will run the Spring Boot server in development mode and auto-reload changes.

### 11. **Build the Project for Production**
bash
./mvnw clean package -Pproduction

This command creates a production build of the Vaadin project.

### 12. **Deploy the Application**
Deploy the resulting .jar or .war file to a production server or container.

That should cover everything from starting the project to deployment!

`;
