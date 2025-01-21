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

export function register_dir_context_create_rust_rocket(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_rust_rocket`,
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
To start a Rust Rocket project from scratch, here’s a step-by-step list of commands and actions you will take:

### 1. **Install Rust (if not already installed)**
	 - Command:
		 bash
		 curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

	 - This will install rustup and the latest stable version of Rust.

### 2. **Install cargo and verify installation**
	 - Command:
		 bash
		 rustup install stable
		 rustc --version
		 cargo --version


### 3. **Create a new Rust project**
	 - Command:
		 bash
		 cargo new my_rocket_app
		 cd my_rocket_app


### 4. **Add Rocket as a dependency in Cargo.toml**
	 - Open Cargo.toml file and add Rocket:
	 - Edit the [dependencies] section:
		 toml
		 [dependencies]
		 rocket = "0.5.0-rc.2"
		 rocket_codegen = "0.5.0-rc.2"


### 5. **Set up Rocket for nightly Rust**
	 - Command:
		 bash
		 rustup override set nightly
		 rustup update nightly


### 6. **Install necessary toolchains**
	 - Command:
		 bash
		 rustup component add rustfmt --toolchain nightly
		 rustup component add clippy --toolchain nightly


### 7. **Edit main.rs**
	 - Edit src/main.rs to include the basic Rocket setup.
		 Example code:
		 rust
		 #[macro_use] extern crate rocket;

		 #[get("/")]
		 fn index() -> &'static str {
				 "Hello, Rocket!"
		 }

		 #[launch]
		 fn rocket() -> _ {
				 rocket::build().mount("/", routes![index])
		 }


### 8. **Run the project to verify everything works**
	 - Command:
		 bash
		 cargo run


### 9. **Add environment configuration (optional)**
	 - If you need to configure environments (development, production), create a Rocket.toml file and add configuration like:
		 toml
		 [default]
		 address = "127.0.0.1"
		 port = 8000


### 10. **Build the project for production (optional)**
	 - Command:
		 bash
		 cargo build --release


### 11. **Test the project**
	 - Add unit or integration tests as needed to your src/tests.rs file and run tests using:
		 bash
		 cargo test


### 12. **Deploy the project (optional)**
	 - To deploy, you'll likely need to transfer the binary to your server:
		 bash
		 scp target/release/my_rocket_app user@your_server:/path/to/deploy


This list covers the process from installing Rust, setting up Rocket, developing your application, testing it, and preparing it for deployment.
`;
