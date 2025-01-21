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

export function register_dir_context_create_scala_zio(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scala_zio`,
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
Here's a step-by-step list of commands and activities to start a new Scala ZIO project from scratch:

### 1. **Set up sbt build tool (Scala Build Tool)**

First, ensure that sbt is installed. If not, install sbt by following instructions from [sbt website](https://www.scala-sbt.org/).

### 2. **Create a new sbt project**
bash
sbt new scala/scala-seed.g8

- This command generates a basic Scala project structure. You'll be prompted to name your project.

### 3. **Navigate into your project directory**
bash
cd <project-name>


### 4. **Edit build.sbt to include ZIO dependencies**
Open the build.sbt file and modify it to include the ZIO library dependencies:
scala
libraryDependencies += "dev.zio" %% "zio" % "2.0.13"

Optionally, you can add other ZIO modules like zio-streams, zio-json, etc., depending on your needs.

### 5. **Update sbt dependencies**
In the project root, refresh sbt to fetch the new dependencies:
bash
sbt update


### 6. **Create main Scala file**
- Create a new file Main.scala in src/main/scala/ directory.
bash
mkdir -p src/main/scala
touch src/main/scala/Main.scala


### 7. **Edit Main.scala**
Open Main.scala and create a simple ZIO application. Example content:
scala
import zio._

object Main extends ZIOAppDefault {
	def run = Console.printLine("Hello ZIO!")
}


### 8. **Run the project**
Compile and run the project using sbt:
bash
sbt run


### 9. **(Optional) Run Tests**
If you add tests in src/test/scala, you can run them with:
bash
sbt test


### 10. **Package your project (optional)**
If you want to create a JAR file:
bash
sbt package


### 11. **Clean the project (optional)**
bash
sbt clean


### 12. **Continuous build (optional)**
You can set sbt to continuously compile and run tests:
bash
sbt ~test


These steps guide you from setting up a Scala ZIO project to running and testing it. Adjust dependencies and source files as needed for your specific use case.
`;
