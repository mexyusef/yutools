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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\desktop_javafx.ts=BACA.md)
`;

export function register_dir_context_create_desktop_javafx(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_desktop_javafx`,
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
Here’s a step-by-step guide to creating a modern JavaFX project, including both commands and key development steps. I assume you are using Maven to manage dependencies and build the project, as it's common for modern JavaFX projects.

### 1. **Set up Maven Project**

bash
# Create a Maven project
mvn archetype:generate -DgroupId=com.example -DartifactId=MyJavaFXApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

# Navigate to the project directory
cd MyJavaFXApp


### 2. **Add JavaFX Dependencies**

Open pom.xml and add JavaFX dependencies:
xml
<dependencies>
	<dependency>
		<groupId>org.openjfx</groupId>
		<artifactId>javafx-controls</artifactId>
		<version>20.0.2</version>
	</dependency>
</dependencies>


You may also need to add the plugin for JavaFX packaging:
xml
<build>
	<plugins>
		<plugin>
			<groupId>org.openjfx</groupId>
			<artifactId>javafx-maven-plugin</artifactId>
			<version>0.0.8</version>
			<configuration>
				<mainClass>com.example.App</mainClass>
			</configuration>
		</plugin>
	</plugins>
</build>


### 3. **Update Java Version Compatibility**

In pom.xml, set the Java version to be compatible with JavaFX:
xml
<properties>
	<maven.compiler.source>17</maven.compiler.source>
	<maven.compiler.target>17</maven.compiler.target>
</properties>


### 4. **Create Main Class**

bash
# Create necessary directories
mkdir -p src/main/java/com/example

# Create the Main class file
touch src/main/java/com/example/App.java


### 5. **Editing Main File**

Open src/main/java/com/example/App.java and implement a basic JavaFX application:

java
package com.example;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class App extends Application {
	@Override
	public void start(Stage primaryStage) {
		Label label = new Label("Hello, JavaFX!");
		StackPane root = new StackPane(label);
		Scene scene = new Scene(root, 400, 300);
		primaryStage.setTitle("JavaFX App");
		primaryStage.setScene(scene);
		primaryStage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}


### 6. **Run the Application**

bash
# Compile and run the JavaFX project using Maven
mvn clean javafx:run


### 7. **Create and Edit FXML File (Optional for MVC)**

If you want to use FXML for UI layout:

bash
# Create an FXML file in the resources directory
mkdir -p src/main/resources/com/example
touch src/main/resources/com/example/MainView.fxml


Edit MainView.fxml with your preferred UI structure:
xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.layout.StackPane?>
<?import javafx.scene.control.Label?>

<StackPane xmlns="http://javafx.com/javafx/8.0.171" xmlns:fx="http://javafx.com/fxml/1" fx:controller="com.example.AppController">
	<Label text="Hello from FXML!" />
</StackPane>


### 8. **Add Controller for FXML (Optional for MVC)**

Create a new controller class for your FXML:

bash
# Create AppController.java
touch src/main/java/com/example/AppController.java


Edit AppController.java:

java
package com.example;

public class AppController {
	// Define event handlers and UI logic here if needed
}


### 9. **Package the Application (Optional)**

If you want to build a packaged application (e.g., a JAR file):

bash
# Create a JAR file
mvn clean package


### 10. **Run the Packaged Application**

bash
# Run the packaged JAR file
java -jar target/MyJavaFXApp-1.0-SNAPSHOT.jar


---

This list covers both the technical commands and key development steps. You can follow this process to start and manage a modern JavaFX project with Maven.
`;
