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

export function register_dir_context_create_scala_akka(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scala_akka`,
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
Here is a step-by-step guide with commands and activities for starting a Scala Akka project from scratch:

### 1. **Install Scala and SBT** (if not already installed)
	- Ensure you have [Scala](https://www.scala-lang.org/download/) and [SBT (Scala Build Tool)](https://www.scala-sbt.org/download.html) installed on your machine.

	You can verify the installation with the following commands:
	bash
	scala -version
	sbt -version


### 2. **Create a New SBT Project**
	bash
	sbt new scala/scala-seed.g8


	This will create a new basic Scala project template. Follow the prompts to name your project.

### 3. **Navigate to the Project Directory**
	bash
	cd your-project-name


### 4. **Update build.sbt for Akka Dependencies**
	- **Edit build.sbt** to include Akka libraries. Add the following Akka dependencies:

	scala
	libraryDependencies ++= Seq(
	  "com.typesafe.akka" %% "akka-actor-typed" % "2.6.20",
	  "com.typesafe.akka" %% "akka-stream" % "2.6.20",
	  "com.typesafe.akka" %% "akka-testkit" % "2.6.20" % Test
	)


### 5. **Create Directory Structure**
	Create the necessary directories for the Scala source files:
	bash
	mkdir -p src/main/scala src/main/resources src/test/scala


### 6. **Editing Main File**
	- **Create and Edit Main.scala** in src/main/scala/ to include a basic Akka system:

	scala
	import akka.actor.typed.ActorSystem

	object Main extends App {
	  val system = ActorSystem(Behaviors.empty, "MyActorSystem")
	  println("Actor system started")
	}


### 7. **Run the Project**
	Run your Akka project using the following SBT command:
	bash
	sbt run


### 8. **Adding More Akka Components (Actors, etc.)**
	- **Edit/Add Actor Code**: Continue developing by adding Akka actors, behaviors, and message protocols in separate Scala files in the src/main/scala/ directory.

### 9. **Testing the Project**
	- Add unit tests for your actors using Akka TestKit. Modify the build.sbt to include test libraries.
	- **Edit/Add Tests** in src/test/scala:

	scala
	import akka.actor.testkit.typed.scaladsl.ScalaTestWithActorTestKit
	import org.scalatest.wordspec.AnyWordSpecLike

	class MyActorSpec extends ScalaTestWithActorTestKit with AnyWordSpecLike {
	  "An actor" must {
		 "do something" in {
			// Test logic here
		 }
	  }
	}


	To run the tests:
	bash
	sbt test


### 10. **Package the Project**
	When you are ready to build the project, package it into a JAR:
	bash
	sbt package


	The JAR will be located in the target/scala-<version> directory.

### 11. **Running the Packaged JAR**
	To run the packaged JAR file:
	bash
	java -jar target/scala-<version>/<your-project-name>.jar


### 12. **Continuous Compilation (Optional)**
	For continuous compilation during development, you can use:
	bash
	sbt ~compile


### 13. **Using Akka Streams (Optional)**
	- If you're using Akka Streams, **edit the Main.scala** file or other parts of the project to include stream processing logic.

### 14. **Running in a Production-like Environment (Optional)**
	To run your project in a production-like environment, use:
	bash
	sbt stage


### 15. **Deploying (Optional)**
	Follow your organization’s deployment procedures. You may use Docker, Kubernetes, or other CI/CD tools to deploy your project.

This sequence should take you from project setup to deployment!

`;
