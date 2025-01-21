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

export function register_dir_context_create_java_selenium(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_selenium`,
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

Here’s a detailed list of steps and commands to set up a modern Java project with Selenium from start to finish, including development activities that aren’t strictly commands but are essential for the process.

### 1. **Install Prerequisites (if not already installed)**

- **Install Java Development Kit (JDK):**
	- Download and install the latest JDK from Oracle or OpenJDK. Set up JAVA_HOME environment variable.
	- Verify installation:
	  bash
	  java -version


- **Install Maven** (if using Maven):
	- Download Maven and set up the M2_HOME environment variable.
	- Verify installation:
	  bash
	  mvn -version


- **Install a Code Editor or IDE**:
	- Download and install **IntelliJ IDEA**, **Eclipse**, or any other preferred IDE.

### 2. **Create a New Maven Project**

- **Create a Maven project from CLI** (or via IDE):
	bash
	mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-selenium-project -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

	This creates the basic directory structure and pom.xml.

- **Navigate to project directory**:
	bash
	cd my-selenium-project


### 3. **Update pom.xml with Selenium Dependency**

- **Edit pom.xml** and add Selenium dependency:
	xml
	<dependencies>
		 <dependency>
			  <groupId>org.seleniumhq.selenium</groupId>
			  <artifactId>selenium-java</artifactId>
			  <version>4.x.x</version> <!-- Replace with the latest version -->
		 </dependency>
	</dependencies>


- **Add TestNG (optional)** if you plan to use TestNG for testing:
	xml
	<dependency>
		 <groupId>org.testng</groupId>
		 <artifactId>testng</artifactId>
		 <version>7.x.x</version>
		 <scope>test</scope>
	</dependency>


### 4. **Download Dependencies**

- **Run Maven to download all dependencies**:
	bash
	mvn clean install


### 5. **Set up WebDriver Binary** (ChromeDriver as example)

- **Download ChromeDriver**:
	- Download the compatible version of ChromeDriver from the official site and place it in a known location.

- **Set the path to ChromeDriver in your project**:
	java
	System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");


### 6. **Edit Main File** (src/main/java/com/mycompany/app/App.java)

- **Write code to initialize the Selenium WebDriver**:
	java
	package com.mycompany.app;

	import org.openqa.selenium.WebDriver;
	import org.openqa.selenium.chrome.ChromeDriver;

	public class App {
		 public static void main(String[] args) {
			  // Set the path to the WebDriver
			  System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");

			  // Initialize WebDriver
			  WebDriver driver = new ChromeDriver();

			  // Navigate to a website
			  driver.get("https://www.google.com");

			  // Perform actions and assertions

			  // Close the browser
			  driver.quit();
		 }
	}


### 7. **Run the Project**

- **Run the project from CLI**:
	bash
	mvn exec:java -Dexec.mainClass="com.mycompany.app.App"


- Alternatively, run it from your IDE by setting up a run configuration.

### 8. **Add Test Automation Framework (Optional)**

- **Add Test Classes** (for example, if using TestNG):
	- **Create test classes under src/test/java**:
	  java
	  package com.mycompany.app;

	  import org.openqa.selenium.WebDriver;
	  import org.openqa.selenium.chrome.ChromeDriver;
	  import org.testng.annotations.Test;

	  public class SampleTest {
			@Test
			public void testGoogleSearch() {
				 System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
				 WebDriver driver = new ChromeDriver();
				 driver.get("https://www.google.com");
				 driver.quit();
			}
	  }


- **Run Tests**:
	bash
	mvn test


### 9. **Handle WebDriver Management (Optional Enhancement)**

- **Use WebDriverManager (no need to manually set the driver path):**
	- Add WebDriverManager to pom.xml:
	  xml
	  <dependency>
			<groupId>io.github.bonigarcia</groupId>
			<artifactId>webdrivermanager</artifactId>
			<version>5.x.x</version> <!-- Replace with the latest version -->
	  </dependency>


- **In your Java code, use WebDriverManager to manage drivers**:
	java
	import io.github.bonigarcia.wdm.WebDriverManager;
	import org.openqa.selenium.WebDriver;
	import org.openqa.selenium.chrome.ChromeDriver;

	public class App {
		 public static void main(String[] args) {
			  WebDriverManager.chromedriver().setup();
			  WebDriver driver = new ChromeDriver();
			  driver.get("https://www.google.com");
			  driver.quit();
		 }
	}


### 10. **Build and Package the Project**

- **Build the project and package it into a JAR file**:
	bash
	mvn clean package


- The JAR file will be located in the target directory.

### 11. **Run Packaged JAR**

- **Run the packaged JAR**:
	bash
	java -cp target/my-selenium-project-1.0-SNAPSHOT.jar com.mycompany.app.App


### 12. **Continuous Integration (CI) Setup** (Optional)

- **Set up CI pipelines (Jenkins, GitHub Actions, etc.)** to automatically build and run tests.

### 13. **Version Control and Deployment**

- **Initialize Git**:
	bash
	git init
	git add .
	git commit -m "Initial commit with Selenium setup"


- **Push to a repository** (e.g., GitHub):
	bash
	git remote add origin https://github.com/username/my-selenium-project.git
	git push -u origin master


---

This process should guide you from project setup to running Selenium WebDriver tests, ensuring you’ve covered all the essential steps and activities.
`;
