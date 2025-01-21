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

export function register_dir_context_create_scraping_jsoup(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_jsoup`,
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
Here’s a step-by-step list of commands and activities for starting and executing a web scraping project using **Jsoup** in Java, from project setup to implementation.

### 1. **Initialize a New Java Project**
If using Maven, start by generating a new project.

**Command:**
bash
mvn archetype:generate -DgroupId=com.example -DartifactId=jsoup-scraper -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false


Or, if using Gradle:
bash
gradle init --type java-application


### 2. **Navigate to Project Directory**
**Command:**
bash
cd jsoup-scraper


### 3. **Add Jsoup Dependency to pom.xml (Maven) or build.gradle (Gradle)**
- **Maven**: Edit pom.xml to include Jsoup as a dependency.

xml
<dependency>
		<groupId>org.jsoup</groupId>
		<artifactId>jsoup</artifactId>
		<version>1.16.1</version> <!-- Make sure to get the latest version -->
</dependency>


- **Gradle**: Add the Jsoup dependency in build.gradle under dependencies.

gradle
dependencies {
		implementation 'org.jsoup:jsoup:1.16.1'
}


### 4. **Update Maven/Gradle Project**
- **Maven**:
	**Command:**
	bash
	mvn clean install


- **Gradle**:
	**Command:**
	bash
	gradle build


### 5. **Create or Edit Main Java File** (src/main/java/com/example/App.java)
This is the file where you’ll write the web scraping logic using Jsoup.

**<Editing Main File>**
- Import the required Jsoup packages:
	java
	import org.jsoup.Jsoup;
	import org.jsoup.nodes.Document;
	import org.jsoup.nodes.Element;
	import org.jsoup.select.Elements;


- Sample Jsoup code for scraping:
	java
	public class App {
			public static void main(String[] args) {
					try {
							Document doc = Jsoup.connect("https://example.com").get();
							Elements links = doc.select("a[href]");
							for (Element link : links) {
									System.out.println("Link: " + link.attr("href"));
							}
					} catch (Exception e) {
							e.printStackTrace();
					}
			}
	}


### 6. **Compile the Project**
**Command (Maven):**
bash
mvn compile


**Command (Gradle):**
bash
gradle compileJava


### 7. **Run the Java Application**
**Command (Maven):**
bash
mvn exec:java -Dexec.mainClass="com.example.App"


**Command (Gradle):**
bash
gradle run


### 8. **Debugging/Testing**
You can debug and test the output by running the program and checking the console output for the expected scraped data.

### 9. **Package the Application**
To bundle the application into a JAR file for distribution.

**Command (Maven):**
bash
mvn package


**Command (Gradle):**
bash
gradle jar


### 10. **Run the Packaged JAR**
After packaging, you can run the generated JAR file.

**Command:**
bash
java -jar target/jsoup-scraper-1.0-SNAPSHOT.jar


---

This flow covers the essential steps to set up, develop, and execute a web scraping project using Jsoup.

`;
