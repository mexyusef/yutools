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

export function register_dir_context_create_java_quarkus(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_quarkus`,
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
Here is a step-by-step guide to starting a Java project using Quarkus, including the CLI commands and development steps.

### 1. Install Java & Quarkus CLI
- Ensure that you have Java 11 or higher installed.
	bash
	java -version

- Install the Quarkus CLI (if you haven't yet):
	bash
	sdk install quarkus


### 2. Create a New Quarkus Project
bash
quarkus create app com.example.myproject

This will generate a basic Quarkus project structure under com.example.myproject.

### 3. Navigate to the Project Directory
bash
cd myproject


### 4. Add Extensions (as needed)
Quarkus uses extensions to add capabilities to the project. Add them using the CLI. For example, to add RESTEasy and Hibernate:
bash
quarkus extension add resteasy
quarkus extension add hibernate-orm

You can list all available extensions:
bash
quarkus extension list


### 5. Start Development Mode
Run Quarkus in development mode to automatically recompile and reload on code changes:
bash
./mvnw compile quarkus:dev


### 6. Edit Main File
Navigate to src/main/java/com/example/myproject and modify the source files (like GreetingResource.java) to add or adjust your business logic.

For instance, modify GreetingResource.java to customize the API response:
java
@Path("/hello")
public class GreetingResource {
		@GET
		@Produces(MediaType.TEXT_PLAIN)
		public String hello() {
				return "Hello, Quarkus!";
		}
}


### 7. Add Unit Tests
Edit or add tests in src/test/java/com/example/myproject.

Example test file:
java
@Test
public void testHelloEndpoint() {
		given()
			.when().get("/hello")
			.then()
				 .statusCode(200)
				 .body(is("Hello, Quarkus!"));
}


### 8. Run Tests
Run all tests using:
bash
./mvnw test


### 9. Package the Application
To build a JAR file for your project:
bash
./mvnw package

The output JAR file will be located in the target directory.

### 10. Create a Native Executable (Optional)
If you want to build a native executable for faster startup and lower memory consumption:
bash
./mvnw package -Pnative

For systems with GraalVM, it creates an optimized binary.

### 11. Run the Application (Packaged JAR)
Run the Quarkus application using the JAR file:
bash
java -jar target/quarkus-app/quarkus-run.jar


### 12. Containerize the Application (Optional)
If you wish to create a container image, use:
bash
./mvnw package -Dquarkus.container-image.build=true


### 13. Deploy to Cloud (Optional)
Deploy the application to a cloud platform like Kubernetes or OpenShift using available Quarkus extensions and configurations, depending on your cloud provider.

---

This covers the essential steps from project creation to packaging and deployment!
`;
