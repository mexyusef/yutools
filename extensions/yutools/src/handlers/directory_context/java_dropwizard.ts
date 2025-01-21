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

export function register_dir_context_create_java_dropwizard(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_dropwizard`,
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
Here’s a comprehensive list of steps (including CLI commands and activities) to start and set up a modern Dropwizard project from scratch:

### 1. **Set Up Your Environment**
	 - Install Java (preferably JDK 8 or 11)
	 - Install Apache Maven (as Dropwizard projects typically use Maven)
	 - Install a code editor (e.g., IntelliJ IDEA or Eclipse)

### 2. **Create Maven Project**
	 bash
	 mvn archetype:generate -DgroupId=com.example -DartifactId=my-dropwizard-app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false


	 - Replace com.example with your desired package name.
	 - Replace my-dropwizard-app with your project name.

### 3. **Add Dropwizard Dependency**
	 - Open the pom.xml file.
	 - Add Dropwizard dependencies (you can check the latest stable version at [Dropwizard website](https://www.dropwizard.io/)):
		 xml
		 <dependencies>
				 <dependency>
						 <groupId>io.dropwizard</groupId>
						 <artifactId>dropwizard-core</artifactId>
						 <version>2.1.0</version> <!-- Replace with latest version -->
				 </dependency>
		 </dependencies>

	 - Save pom.xml and run Maven to download dependencies:
		 bash
		 mvn clean install


### 4. **Define the Dropwizard Application Class**
	 - **Activity**: Create the main application class, which will extend Application.
	 - **Editing main file (Java Class)**: Create a file under src/main/java/com/example/MyApplication.java:
		 java
		 package com.example;

		 import io.dropwizard.Application;
		 import io.dropwizard.setup.Bootstrap;
		 import io.dropwizard.setup.Environment;

		 public class MyApplication extends Application<MyConfiguration> {
				 public static void main(String[] args) throws Exception {
						 new MyApplication().run(args);
				 }

				 @Override
				 public void initialize(Bootstrap<MyConfiguration> bootstrap) {
						 // Initialization code
				 }

				 @Override
				 public void run(MyConfiguration configuration, Environment environment) {
						 // Register resources
				 }
		 }


### 5. **Create Configuration Class**
	 - **Editing main file**: Create a MyConfiguration.java class under src/main/java/com/example/:
		 java
		 package com.example;

		 import io.dropwizard.Configuration;

		 public class MyConfiguration extends Configuration {
				 // Define configuration fields if necessary
		 }


### 6. **Create First Resource**
	 - **Activity**: Define a REST resource for Dropwizard (e.g., a Hello World endpoint).
	 - **Editing resource file**: Create HelloResource.java in src/main/java/com/example/resources/:
		 java
		 package com.example.resources;

		 import javax.ws.rs.GET;
		 import javax.ws.rs.Path;
		 import javax.ws.rs.Produces;
		 import javax.ws.rs.core.MediaType;

		 @Path("/hello")
		 public class HelloResource {

				 @GET
				 @Produces(MediaType.TEXT_PLAIN)
				 public String sayHello() {
						 return "Hello, Dropwizard!";
				 }
		 }

	 - **Register resource in the MyApplication class**:
		 java
		 @Override
		 public void run(MyConfiguration configuration, Environment environment) {
				 final HelloResource resource = new HelloResource();
				 environment.jersey().register(resource);
		 }


### 7. **Create Configuration File**
	 - **Activity**: Create the config.yml file in the root directory of your project:
		 yaml
		 server:
			 applicationConnectors:
				 - type: http
					 port: 8080
		 logging:
			 level: INFO


### 8. **Build the Project**
	 bash
	 mvn package


	 This will generate a JAR file with your application.

### 9. **Run the Dropwizard Application**
	 bash
	 java -jar target/my-dropwizard-app-1.0-SNAPSHOT.jar server config.yml


	 The application will now be running at http://localhost:8080/hello.

### 10. **Test the Application**
	 - **Activity**: Open your browser or use a tool like curl to test the API:
		 bash
		 curl http://localhost:8080/hello


### 11. **Additional Development Activities**
	 - **Activity**: Create unit and integration tests.
	 - **Activity**: Set up database configurations (if applicable).
	 - **Activity**: Refactor code as you add more resources.
	 - **Activity**: Update pom.xml with additional dependencies (e.g., for database, logging, testing).

### 12. **Final Build and Deployment**
	 - After development and testing, build the project again:
		 bash
		 mvn clean package

	 - Deploy the JAR file to your desired environment.

This list takes you from project creation to deployment of a basic Dropwizard application.
`;
