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

export function register_dir_context_create_rust_tokio(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_rust_tokio`, async (uri: vscode.Uri) => {
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
Here’s a step-by-step guide to start a **Rust Tokio project** from scratch, including commands and key activities:

### 1. **Install Rust (if not already installed)**

If you don’t have Rust installed, first install Rust by running:
bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh


Update your Rust installation (optional but recommended):
bash
rustup update


### 2. **Create a new Rust project**

Use Cargo (Rust’s package manager) to create a new binary project:
bash
cargo new my_tokio_project
cd my_tokio_project


### 3. **Add Tokio as a dependency**

Edit the Cargo.toml file to add Tokio as a dependency. Open the file with your preferred text editor:
bash
nano Cargo.toml


Add the following under [dependencies]:
toml
[dependencies]
tokio = { version = "1", features = ["full"] }


Save the file and close the editor.

### 4. **Edit the main.rs file to use Tokio**

Open the src/main.rs file:
bash
nano src/main.rs


Replace the content with a basic Tokio example:

rust
#[tokio::main]
async fn main() {
	println!("Hello from Tokio!");
}


Save and close the file.

### 5. **Build the project**

To ensure everything is set up correctly, build the project:
bash
cargo build


### 6. **Run the project**

Run the project to see your program in action:
bash
cargo run


### 7. **Write your async code**

Now, edit the src/main.rs file to include more asynchronous functionality using Tokio. For example, you can implement a basic delay with Tokio:

rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
	println!("Task started...");
	sleep(Duration::from_secs(3)).await;
	println!("Task finished after 3 seconds!");
}


Save and close the file.

### 8. **Run the project again**
bash
cargo run


### 9. **Add additional dependencies (optional)**

If your project requires more crates (e.g., tokio-tungstenite, tokio-postgres, etc.), add them to your Cargo.toml file and re-run cargo build to install them.

For example, to add tokio-tungstenite for WebSocket support:
bash
nano Cargo.toml


Add the new dependency:
toml
tokio-tungstenite = "0.15"


Then run:
bash
cargo build


### 10. **Test your project**

If you have any tests, you can run them using:
bash
cargo test


### 11. **Format your code (optional but recommended)**

Rust has a built-in code formatter:
bash
cargo fmt


### 12. **Lint your code**

Use clippy to lint your code and catch common mistakes:
bash
cargo clippy


### 13. **Build for release (optional)**

For a release build:
bash
cargo build --release


This will generate an optimized binary in the target/release/ directory.

### 14. **Run release build**
bash
./target/release/my_tokio_project


### 15. **Done!**

You now have a fully functional Tokio project! Continue developing by editing your Rust files and running the above commands as needed.


`;
