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

export function register_dir_context_create_java_vertx(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_vertx`,
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
Here’s a step-by-step guide to starting a modern Java + Vert.x project, including commands and key activities:

### 1. **Install Prerequisites**
Ensure you have the required tools:
- Java SDK (e.g., OpenJDK 11 or higher)
- Maven or Gradle (for dependency management)

bash
# Check Java version
java -version

# Install Maven (if not installed)
sudo apt install maven

# Install Gradle (if using Gradle)
brew install gradle


### 2. **Create a Maven Project**
You can use Maven archetypes for Vert.x or create it manually.

bash
# Create Maven project
mvn archetype:generate -DgroupId=com.example -DartifactId=vertx-demo -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

cd vertx-demo


For Gradle:
bash
gradle init --type java-application


### 3. **Add Vert.x Dependency**
Edit pom.xml (Maven) or build.gradle (Gradle) to include Vert.x dependencies.

xml
<!-- Add Vert.x dependencies in pom.xml -->
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-core</artifactId>
	<version>4.4.0</version>
</dependency>
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-web</artifactId>
	<version>4.4.0</version>
</dependency>


For Gradle:
groovy
// Add Vert.x dependencies in build.gradle
implementation 'io.vertx:vertx-core:4.4.0'
implementation 'io.vertx:vertx-web:4.4.0'


### 4. **Build the Project**
bash
# Build using Maven
mvn clean install

# Build using Gradle
gradle build


### 5. **Create Main Vert.x File**
- **Activity**: Edit the src/main/java/com/example/App.java or create a new file.
- Add a Vert.x HTTP server setup in this file.

java
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;

public class MainVerticle extends AbstractVerticle {
	public static void main(String[] args) {
		Vertx vertx = Vertx.vertx();
		vertx.deployVerticle(new MainVerticle());
	}

	@Override
	public void start() {
		vertx.createHttpServer().requestHandler(req -> req.response().end("Hello Vert.x!")).listen(8080);
	}
}


### 6. **Run the Application**
bash
# Run the application with Maven
mvn compile exec:java -Dexec.mainClass=com.example.MainVerticle

# Run the application with Gradle
gradle run


### 7. **Test the Application**
Open a browser and visit http://localhost:8080 to see "Hello Vert.x!".

### 8. **Edit Code / Add Business Logic**
- **Activity**: Develop and modify your Vert.x project (add routes, services, etc.).

### 9. **Run Unit Tests**
Ensure that your unit tests are in the src/test/java/ directory.

bash
# Run tests using Maven
mvn test

# Run tests using Gradle
gradle test


### 10. **Package the Application**
Once you're ready to build the final JAR:

bash
# Package with Maven
mvn package

# Package with Gradle
gradle jar


### 11. **Run Packaged JAR**
bash
# Run the packaged JAR
java -jar target/vertx-demo-1.0-SNAPSHOT.jar


### 12. **Deploy to Production**
- **Activity**: Deploy the built JAR to your server or container for production use.

---

This should help you navigate from setting up to deploying a Vert.x project!

`;
