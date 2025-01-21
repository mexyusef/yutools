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

export function register_dir_context_create_scala_spark(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scala_spark`,
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
Here is a step-by-step guide with commands and activities for starting and finishing a Scala-based Apache Spark project:

### 1. **Install Prerequisites**
Ensure you have the following installed:
- **Scala**: Install via SDKMAN:
	bash
	sdk install scala

- **Apache Spark**: Download and install Spark:
	bash
	wget https://archive.apache.org/dist/spark/spark-<version>/spark-<version>-bin-hadoop<version>.tgz
	tar xvf spark-<version>-bin-hadoop<version>.tgz

	Or use the official Spark distribution if Hadoop isn't needed:
	bash
	sudo apt-get install apache-spark


- **sbt (Scala Build Tool)**: Install sbt:
	bash
	sudo apt-get install sbt


### 2. **Create a New sbt Project**
	bash
	sbt new scala/hello-world.g8

This will generate a basic sbt project structure.

### 3. **Change Directory to Your Project**
	bash
	cd <project-name>


### 4. **Modify build.sbt to Add Spark Dependencies**
Add Spark-related dependencies in build.sbt:
	sbt
	name := "SparkProject"

	version := "0.1"

	scalaVersion := "2.12.10"  // or your preferred version

	libraryDependencies ++= Seq(
		"org.apache.spark" %% "spark-core" % "3.0.0",
		"org.apache.spark" %% "spark-sql" % "3.0.0"
	)


### 5. **Download Dependencies**
	bash
	sbt update


### 6. **Editing the Main Application File**
Go to src/main/scala and modify or create the Scala application file (e.g., Main.scala) with Spark code. Here is a sample content:

scala
import org.apache.spark.sql.SparkSession

object Main extends App {
	val spark = SparkSession.builder
		.appName("Simple Scala Spark Application")
		.config("spark.master", "local")
		.getOrCreate()

	val data = spark.read.text("data.txt")
	data.show()

	spark.stop()
}

Make sure to include any necessary logic or transformations based on your project.

### 7. **Compile the Scala Code**
	bash
	sbt compile


### 8. **Run the Scala Spark Application**
	bash
	sbt run


### 9. **Testing**
If you want to write unit tests, you can modify the src/test/scala directory, write tests, and run them:
	bash
	sbt test


### 10. **Packaging the Project**
Package the project into a JAR file:
	bash
	sbt package


### 11. **Submit the JAR to a Spark Cluster**
If you want to run the project on a Spark cluster, submit it using spark-submit:
	bash
	./spark/bin/spark-submit \
		--class Main \
		--master local[2] \
		target/scala-2.12/sparkproject_2.12-0.1.jar


### 12. **Running in Cluster Mode (Optional)**
You can also run the project on a Spark cluster with a specific cluster manager (e.g., YARN, Mesos):
	bash
	./spark/bin/spark-submit \
		--class Main \
		--master yarn \
		--deploy-mode cluster \
		target/scala-2.12/sparkproject_2.12-0.1.jar


### 13. **Cleaning the Project (Optional)**
Clean the build artifacts if needed:
	bash
	sbt clean


### 14. **Exiting sbt Shell**
If you're working inside the sbt shell, you can exit it with:
	bash
	exit


---

By following these steps, you'll be able to create, build, test, and run a Scala Spark project from start to finish.
`;
