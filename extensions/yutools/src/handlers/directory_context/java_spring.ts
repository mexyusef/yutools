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

export function register_dir_context_create_java_spring(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_spring`,
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
Here’s a step-by-step list of commands and activities required to start a modern Spring MVC project using Java:

### 1. **Set Up Environment**
	- Install **JDK** (if not installed already)
	- Install **Maven** (if not installed already)
	- Install **Spring Tool Suite (STS)** or **IntelliJ IDEA** (optional, but recommended)

### 2. **Initialize the Spring MVC Project**
	- **Using Spring Initializr** (recommended for modern Spring projects)

	bash
	curl https://start.spring.io/starter.zip \
	-d dependencies=web,thymeleaf \
	-d language=java \
	-d type=maven-project \
	-d javaVersion=17 \
	-d groupId=com.example \
	-d artifactId=demo-springmvc \
	-d name=demo-springmvc \
	-o demo-springmvc.zip


	- Unzip the downloaded file:
	bash
	unzip demo-springmvc.zip
	cd demo-springmvc


	Alternatively, you can generate the project directly via the [Spring Initializr](https://start.spring.io/) web interface.

### 3. **Import into IDE**
	- Open the generated project in your IDE (e.g., IntelliJ or Spring Tool Suite).

### 4. **Edit the pom.xml**
	If you need to add more dependencies, edit pom.xml and add other dependencies as needed.

	Example to add **Spring Data JPA** and **MySQL Connector**:
	xml
	<dependencies>
		 <dependency>
			  <groupId>org.springframework.boot</groupId>
			  <artifactId>spring-boot-starter-data-jpa</artifactId>
		 </dependency>
		 <dependency>
			  <groupId>mysql</groupId>
			  <artifactId>mysql-connector-java</artifactId>
		 </dependency>
	</dependencies>


### 5. **Build the Project**
	Run this command to build the project:
	bash
	mvn clean install


### 6. **Edit application.properties or application.yml**
	- Add configuration for the server, database, or other services.

	Example (application.properties):
	properties
	server.port=8080
	spring.datasource.url=jdbc:mysql://localhost:3306/mydb
	spring.datasource.username=root
	spring.datasource.password=secret
	spring.jpa.hibernate.ddl-auto=update


### 7. **Create Controller Class**
	**Create the main controller class** in src/main/java/com/example/demo/controller/HomeController.java

	java
	@Controller
	public class HomeController {
		 @GetMapping("/")
		 public String home() {
			  return "home";
		 }
	}


### 8. **Create Thymeleaf Template**
	**Create the Thymeleaf HTML template** in src/main/resources/templates/home.html

	html
	<!DOCTYPE html>
	<html xmlns:th="http://www.thymeleaf.org">
	<head>
		 <title>Home</title>
	</head>
	<body>
		 <h1>Welcome to Spring MVC!</h1>
	</body>
	</html>


### 9. **Run the Application**
	- You can run the Spring Boot application using Maven:
	bash
	mvn spring-boot:run


	- Alternatively, run it via your IDE by executing the DemoApplication class (typically located in src/main/java/com/example/demo).

### 10. **Access the Application**
	Open a web browser and visit:

	http://localhost:8080/


### 11. **Add More Features**
	- You can now add more features, such as:
	  - Adding models
	  - Configuring databases
	  - Adding more controllers and views

### 12. **Test the Application**
	Create test cases for your application using JUnit (which is included by default).

	Example:
	java
	@SpringBootTest
	class DemoApplicationTests {
		 @Test
		 void contextLoads() {
		 }
	}


### 13. **Package the Application**
	Once development is done, you can package the application into a JAR file for deployment:
	bash
	mvn package


	This creates a JAR file in the target directory, which you can run with:
	bash
	java -jar target/demo-springmvc-0.0.1-SNAPSHOT.jar


### 14. **Deploy the Application**
	Deploy the JAR file to your server or hosting platform.

### 15. **Monitor and Optimize**
	- Set up logging, performance monitoring, and security (e.g., Spring Security) for production environments.

This workflow covers the essential steps for creating, developing, and running a modern Spring MVC project from scratch.
`;
