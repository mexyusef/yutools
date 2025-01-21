import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
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
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\handlers\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_android_kotlin(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_android_kotlin`,
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
Here’s a comprehensive step-by-step guide for starting a modern Android project using **Kotlin** and **Jetpack Compose**,
from setting up the project to running it on a simulator.
I've included both the necessary CLI commands and development activities.

### 1. **Install Android Studio (if not already installed)**
	- Download and install Android Studio from the official [Android Studio website](https://developer.android.com/studio).

### 2. **Create a New Android Project (Jetpack Compose)**
	This step is done inside **Android Studio**, not via the command line.

	1. Open **Android Studio**.
	2. Click on **New Project**.
	3. Select the **Empty Compose Activity** template.
	4. Click **Next**.
	5. Set your project name, package name, save location, language as **Kotlin**, and minimum SDK.
	6. Click **Finish**.

### 3. **Sync Gradle Files**
	Android Studio should automatically sync your Gradle files after project creation. If it doesn’t, you can trigger the sync:


	./gradlew sync


### 4. **Install Kotlin Plugin (if needed)**
	Ensure that the Kotlin plugin is installed and updated in Android Studio (this is usually handled automatically).

	1. Go to **File > Settings > Plugins**.
	2. Search for **Kotlin**.
	3. If not installed or outdated, click **Install** or **Update**.

### 5. **Setup Emulator (Simulator)**
	To create a new Android Emulator:

	1. Go to **Tools > Device Manager**.
	2. Click on **Create Device**.
	3. Select a device (e.g., Pixel 5) and click **Next**.
	4. Choose the system image (download it if necessary).
	5. Click **Finish**.

### 6. **Launch the Emulator**
	You can launch the emulator using Android Studio or the command line:

	**From Android Studio:**
	- Go to **Device Manager** and click the **Play** button next to the emulator.

	**From the CLI:**

	emulator -avd <emulator_name>


### 7. **Build and Run the Project**
	Build the project and deploy it to the emulator.

	**From Android Studio:**
	- Click on the **Run** button (Green triangle) in the toolbar.

	**From the CLI:**

	./gradlew assembleDebug
	./gradlew installDebug


### 8. **Editing Main Files (Jetpack Compose Code)**
	Now you can start working on your UI using Jetpack Compose.

	**Activity:**
	- Open the MainActivity.kt file.
	- Edit the default setContent block to modify the UI:

	kotlin
	setContent {
		 MaterialTheme {
			  // Your Composable functions here
		 }
	}


	**Sample Jetpack Compose code:**
	kotlin
	@Composable
	fun Greeting(name: String) {
		 Text(text = "Hello, $name!")
	}

	@Preview(showBackground = true)
	@Composable
	fun DefaultPreview() {
		 Greeting("Android")
	}


### 9. **Hot Reload (or Apply Changes)**
	While running the emulator, you can apply changes without restarting the app:

	- **From Android Studio:** Click **Apply Changes and Restart Activity** button (lightning icon).

### 10. **Debugging (Optional)**
	You can attach a debugger to the running emulator.

	**From Android Studio:**
	- Click on the **Debug** button next to the **Run** button.

	**From the CLI:**

	./gradlew assembleDebug
	adb install -r app/build/outputs/apk/debug/app-debug.apk


### 11. **Build APK for Production (Release)**
	Once the project is ready for production, you can build a release APK:


	./gradlew assembleRelease


	The APK will be located in app/build/outputs/apk/release/.

---

This guide takes you through the entire workflow, from project setup to editing code, building, and running the app using Kotlin and Jetpack Compose.
`;
