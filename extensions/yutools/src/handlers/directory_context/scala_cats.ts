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

export function register_dir_context_create_scala_cats(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scala_cats`,
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
Here’s a step-by-step list of commands and activities to start a Scala project using **Typelevel Cats**, including setup, dependencies, and development activities:

### 1. **Install Necessary Tools**
Ensure you have **Scala**, **sbt**, and a suitable IDE (like IntelliJ IDEA or Visual Studio Code) installed.

- **Install Scala:**
	bash
	brew install scala


- **Install sbt (Scala Build Tool):**
	bash
	brew install sbt


### 2. **Create a New sbt Project**
Run this command to initialize a new sbt project:

bash
sbt new scala/scala-seed.g8


Follow the prompts to name your project (e.g., cats-example-project).

### 3. **Navigate to the Project Directory**
bash
cd cats-example-project


### 4. **Add Cats Dependencies**
- Open the build.sbt file:
	bash
	nano build.sbt


- Add the following lines to include **Typelevel Cats** library dependencies:
	scala
	libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"


### 5. **Update Dependencies**
Fetch the new dependencies using sbt:
bash
sbt update


### 6. **Edit Main File**
Edit the main application source file located in src/main/scala/Main.scala (or create a new one if needed).

- Example using your editor:
	bash
	nano src/main/scala/Main.scala


- Add some simple Cats functionality. Example content:
	scala
	import cats.implicits._

	object Main extends App {
		val result = (1.some, 2.some).mapN(_ + _)
		println(result)  // Prints Some(3)
	}


### 7. **Compile the Project**
Compile the code using sbt:
bash
sbt compile


### 8. **Run the Project**
Run the project:
bash
sbt run


### 9. **Test the Project (Optional)**
If you want to add tests using **Cats** functionalities:

- Add **ScalaTest** and **Cats Effect** for testing to build.sbt:
	scala
	libraryDependencies ++= Seq(
		"org.typelevel" %% "cats-effect" % "3.5.1" % Test,
		"org.scalatest" %% "scalatest" % "3.2.16" % Test
	)


- Create a test file in src/test/scala/ (e.g., CatsTest.scala):
	bash
	nano src/test/scala/CatsTest.scala


- Example test:
	scala
	import org.scalatest.flatspec.AnyFlatSpec
	import org.typelevel.cats.syntax.option._

	class CatsTest extends AnyFlatSpec {
		"Option" should "combine correctly" in {
			assert((1.some, 2.some).mapN(_ + _) == Some(3))
		}
	}


- Run tests:
	bash
	sbt test


### 10. **Continuous Development**
To continuously compile and run the project, you can use:
bash
sbt ~run


### 11. **Package the Project (Optional)**
To create a jar file:
bash
sbt package


### 12. **Clean the Project (Optional)**
To clean compiled files:
bash
sbt clean


With these steps, you’ll have a Scala project using **Typelevel Cats** set up and running!
`;
