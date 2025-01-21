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

export function register_dir_context_create_java_jakartaee(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_java_jakartaee`,
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
Here’s a comprehensive step-by-step guide to start a modern Jakarta EE project, including both CLI commands and the main development tasks that are not command-based but essential to the process.

### 1. **Install Java and Maven**
Make sure you have Java and Maven installed on your machine.

bash
# Verify Java installation
java -version

# Verify Maven installation
mvn -version


### 2. **Create a New Maven Project**
Create a new Maven project using the Maven archetype:generate command.

bash
mvn archetype:generate -DgroupId=com.example -DartifactId=myjakartaeeproject -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false


### 3. **Navigate to Project Directory**
bash
cd myjakartaeeproject


### 4. **Update pom.xml**
Open the pom.xml file and update it with the necessary Jakarta EE dependencies:

1. Add the Jakarta EE 10 (or 9) dependency:
	xml
	<dependency>
		<groupId>jakarta.platform</groupId>
		<artifactId>jakarta.jakartaee-web-api</artifactId>
		<version>10.0.0</version>
		<scope>provided</scope>
	</dependency>


2. Add the necessary build plugins if not already present:
	xml
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-war-plugin</artifactId>
				<version>3.3.1</version>
				<configuration>
					<failOnMissingWebXml>false</failOnMissingWebXml>
				</configuration>
			</plugin>
		</plugins>
	</build>


### 5. **Add Web Application Directory Structure**
Ensure your project has the required structure:

src
 └── main
	 ├── java
	 ├── resources
	 └── webapp
		 └── WEB-INF
			 └── web.xml (optional for Jakarta EE)


### 6. **Edit web.xml or Annotations**
- If you're using annotations (modern Jakarta EE), you can skip the web.xml configuration and define servlets or resources using annotations like @WebServlet.

- Example of a simple servlet using annotation:
	java
	import jakarta.servlet.annotation.WebServlet;
	import jakarta.servlet.http.HttpServlet;
	import jakarta.servlet.http.HttpServletRequest;
	import jakarta.servlet.http.HttpServletResponse;

	@WebServlet("/hello")
	public class HelloServlet extends HttpServlet {
		protected void doGet(HttpServletRequest request, HttpServletResponse response) {
			response.getWriter().println("Hello Jakarta EE!");
		}
	}


### 7. **Develop Business Logic**
- Start implementing your business logic by creating service classes, repositories, or any necessary layers.

- For example, create a simple JAX-RS endpoint for a REST API:
	java
	import jakarta.ws.rs.GET;
	import jakarta.ws.rs.Path;
	import jakarta.ws.rs.core.Response;

	@Path("/greet")
	public class GreetingResource {
		@GET
		public Response hello() {
			return Response.ok("Hello Jakarta EE!").build();
		}
	}


### 8. **Packaging and Building**
Once you've developed your application logic, package the project as a WAR file.

bash
mvn clean package


### 9. **Deploy on a Jakarta EE-Compatible Application Server**
Choose a Jakarta EE-compatible server like **Payara**, **WildFly**, or **TomEE**.

#### Example: Using **Payara Micro** to run the WAR:
bash
# Download Payara Micro
curl -L -o payara-micro.jar https://search.maven.org/remotecontent?filepath=fish/payara/distributions/payara-micro/6.0.0/payara-micro-6.0.0.jar

# Run your application
java -jar payara-micro.jar --deploy target/myjakartaeeproject.war


### 10. **Test the Application**
Open your browser or API client and test the application at:

http://localhost:8080/myjakartaeeproject/hello


or for the JAX-RS resource:

http://localhost:8080/myjakartaeeproject/api/greet


### 11. **Debugging and Further Development**
- **Edit source files**: Continue to iterate on your main classes, servlets, or JAX-RS resources.
- **Test endpoints and features**: Use Postman or a browser to hit the REST endpoints you create.
- **Add tests**: Write unit tests for your code, and use mvn test to execute them.

### 12. **Run on Docker (Optional)**
You can Dockerize your Jakarta EE project if desired.

1. Create a Dockerfile:
	dockerfile
	FROM payara/micro
	COPY target/myjakartaeeproject.war $DEPLOY_DIR


2. Build and run:
	bash
	docker build -t myjakartaeeapp .
	docker run -p 8080:8080 myjakartaeeapp


### 13. **Iterate and Refactor**
As you develop your application, continue the cycle of editing, testing, and building your project using the previous steps.

### 14. **Deployment to Production**
For production deployment, you'll typically use a more robust application server like **WildFly**, **Payara Server**, or a cloud-based solution. Make sure to include configurations for security, scalability, and database connectivity.

---

This workflow gives you a full process, from starting a new Jakarta EE project to deployment. You can adjust specific server commands based on your preferred deployment method (e.g., Docker, Kubernetes, or cloud).
`;
