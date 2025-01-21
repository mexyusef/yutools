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

export function register_dir_context_create_tauri(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_tauri`,
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
Here's a detailed step-by-step guide, including both CLI commands and activities needed to start a Tauri Rust/TypeScript project:

### 1. **Install Rust**
Tauri requires Rust to be installed. If you don't already have Rust, install it by running:
bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh


### 2. **Install Node.js**
Tauri uses Node.js for the frontend (TypeScript). Ensure you have it installed:
bash
# Check if Node.js is installed
node -v
npm -v

# If not installed, use a package manager (e.g., Homebrew, nvm, etc.)
# Example with Homebrew:
brew install node


### 3. **Install Tauri CLI**
Install Tauri’s command-line interface globally:
bash
cargo install tauri-cli


### 4. **Create a New Tauri Project**
You can scaffold a new project using Tauri’s CLI:
bash
# Create a new directory for the project
mkdir my-tauri-app
cd my-tauri-app

# Initialize a new Tauri project
npm create tauri-app


### 5. **Install Dependencies**
Once the project is created, install the necessary Node dependencies:
bash
npm install


### 6. **Edit Main TypeScript File**
After the project is initialized, open the project in your favorite editor (e.g., VSCode) and edit the src files for the TypeScript frontend. Typically, you'd modify files like:
- src/App.tsx or src/main.ts (depending on the scaffold template you chose).

Make necessary modifications to your frontend.

### 7. **Edit tauri.conf.json Configuration File**
Edit the src-tauri/tauri.conf.json file to configure your Tauri application:
json
{
  "build": {
	"beforeDevCommand": "npm run dev",
	"beforeBuildCommand": "npm run build",
	...
  },
  "tauri": {
	"windows": [
	  {
		"title": "My Tauri App",
		"width": 800,
		"height": 600
	  }
	]
  }
}


### 8. **Edit Rust Backend (src-tauri/src/main.rs)**
Modify the Rust backend for any custom functionality or APIs. You can expose custom commands to the frontend if needed:
rust
fn main() {
	tauri::Builder::default()
		.invoke_handler(tauri::generate_handler![my_custom_command])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

#[tauri::command]
fn my_custom_command() -> String {
	"Hello from Rust!".into()
}


### 9. **Run the Development Server**
To start the development server with hot reloading for the frontend:
bash
npm run tauri dev


### 10. **Test and Debug**
Now, your app will be running, and you can test your frontend and backend functionality. Make sure your TypeScript and Rust components interact as expected.

### 11. **Build the App**
Once you're ready to build the app for production, run the following command:
bash
npm run tauri build


### 12. **Generate an Installer**
After the build is completed, Tauri will generate platform-specific binaries. You can also generate an installer (e.g., .dmg for macOS, .exe for Windows).

### 13. **Package and Distribute**
The compiled binaries and installer will be available in the src-tauri/target/release/ folder. Package and distribute the app as needed.

---

### Summary of Commands and Actions:

1. **Install Rust:**
	bash
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

2. **Install Node.js:**
	bash
	node -v

3. **Install Tauri CLI:**
	bash
	cargo install tauri-cli

4. **Create a New Tauri Project:**
	bash
	mkdir my-tauri-app
	cd my-tauri-app
	npm create tauri-app

5. **Install Dependencies:**
	bash
	npm install

6. **Edit Main TypeScript File:** *(activity)*
	- Modify src/App.tsx or src/main.ts.
7. **Edit tauri.conf.json:** *(activity)*
	- Modify configuration options in src-tauri/tauri.conf.json.
8. **Edit Rust Backend (optional):** *(activity)*
	- Modify src-tauri/src/main.rs to add backend functionality.
9. **Run the Development Server:**
	bash
	npm run tauri dev

10. **Build the App:**
	bash
	npm run tauri build

11. **Package and Distribute:** *(activity)*
	- Distribute the built binaries and installer from src-tauri/target/release/.

This should get you up and running from start to finish for a Tauri project!
`;
