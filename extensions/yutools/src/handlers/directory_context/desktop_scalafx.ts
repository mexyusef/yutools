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

export function register_dir_context_create_desktop_scalafx(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_desktop_scalafx`,
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
Here’s a step-by-step guide, including the commands you’ll need to run and the key activities to set up a **ScalaFX project** from start to finish.

### Step 1: Install Prerequisites
1. **Install JDK (Java Development Kit)**: Make sure you have JDK 8 or later installed.
	bash
	java -version


2. **Install Scala**: Ensure Scala is installed on your machine.
	bash
	scala -version


3. **Install SBT (Scala Build Tool)**: You will need SBT to manage dependencies and build the project.
	bash
	sbt --version


### Step 2: Create a New Scala Project with SBT

1. **Create a project directory**:
	bash
	mkdir MyScalaFXProject
	cd MyScalaFXProject


2. **Create a new SBT project**:
	bash
	sbt new scala/scala-seed.g8


3. **Enter project name** and other project details when prompted.

### Step 3: Add ScalaFX Dependency

1. **Edit build.sbt**: Open the build.sbt file in a text editor and add the ScalaFX dependency.

	bash
	<editing build.sbt>


	Add the following line to libraryDependencies in build.sbt:
	scala
	libraryDependencies += "org.scalafx" %% "scalafx" % "19.0.0-R27"


2. **Ensure correct settings for JDK and Scala version**:
	scala
	scalaVersion := "3.2.2"  // Use the Scala version you want


### Step 4: Create the Main Application File

1. **Create the main Scala file**: Inside src/main/scala, create a new file named Main.scala.

	bash
	mkdir -p src/main/scala
	touch src/main/scala/Main.scala


2. **Edit Main.scala**: Open the Main.scala file in a text editor.

	bash
	<editing src/main/scala/Main.scala>


	Add the following code as a basic ScalaFX template:
	scala
	import scalafx.application.JFXApp3
	import scalafx.scene.Scene
	import scalafx.scene.control.Label

	object Main extends JFXApp3 {
	  override def start(): Unit = {
		 stage = new JFXApp3.PrimaryStage {
			title = "Hello ScalaFX"
			scene = new Scene {
			  content = new Label("Hello, ScalaFX!")
			}
		 }
	  }
	}


### Step 5: Run the Project

1. **Compile and run the project** using SBT:
	bash
	sbt run


### Step 6: Package the Project (Optional)

1. **To create a standalone JAR file**:
	bash
	sbt assembly


	Make sure you have the **sbt-assembly** plugin installed by adding the following to project/plugins.sbt:
	scala
	addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.1.0")


### Step 7: Further Development

1. **Edit and expand your project**: Continue editing the Scala files, adding new features, and building the UI.

	bash
	<editing and adding more Scala code>


2. **Re-run the project**:
	bash
	sbt run


### Summary of Key Commands
1. **Create Project**:
	bash
	mkdir MyScalaFXProject && cd MyScalaFXProject
	sbt new scala/scala-seed.g8


2. **Add ScalaFX Dependency**:
	bash
	<editing build.sbt>


3. **Create Main File**:
	bash
	mkdir -p src/main/scala && touch src/main/scala/Main.scala


4. **Run the Project**:
	bash
	sbt run


5. **Package the Project** (Optional):
	bash
	sbt assembly


With this setup, you'll have a basic ScalaFX project ready to go!
`;
