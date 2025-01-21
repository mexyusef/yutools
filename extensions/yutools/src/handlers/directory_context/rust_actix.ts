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

export function register_dir_context_create_rust_actix(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_rust_actix`,
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
Here’s a complete list of commands and development steps to start a **Rust Actix** project from start to finish, including steps like editing files:

### 1. **Install Rust (if not already installed)**

bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh


### 2. **Install Actix CLI (Optional)**
Install the CLI to help create Actix projects easily.

bash
cargo install actix-cli


### 3. **Create a new Cargo project**

bash
cargo new my-actix-project --bin


Navigate to the project directory:
bash
cd my-actix-project


### 4. **Add Actix dependencies to Cargo.toml**
Open Cargo.toml and add Actix dependencies:

toml
[dependencies]
actix-web = "4"
actix-rt = "2"


### 5. **Build the project to fetch dependencies**

bash
cargo build


### 6. **Edit main.rs**
In src/main.rs, replace the default code with the following:

rust
use actix_web::{web, App, HttpServer, HttpResponse, Responder};

async fn hello() -> impl Responder {
	HttpResponse::Ok().body("Hello, Actix!")
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
	HttpServer::new(|| {
		App::new()
			.route("/", web::get().to(hello))
	})
	.bind("127.0.0.1:8080")?
	.run()
	.await
}


### 7. **Run the development server**

bash
cargo run


This will start the server at http://127.0.0.1:8080.

### 8. **Test the server**
Open your browser or use a tool like curl to test the server:

bash
curl http://127.0.0.1:8080


It should return:

Hello, Actix!


### 9. **Edit main.rs for additional functionality**
At this point, you may want to add more routes, middleware, or other features to your application.

### 10. **Re-run the server after changes**

Every time you make changes, you need to restart the server:

bash
cargo run


Or you can use a tool like **cargo-watch** to watch for file changes:

bash
cargo install cargo-watch
cargo watch -x run


### 11. **Build for release**

When ready to deploy, build the project in release mode for optimizations:

bash
cargo build --release


### 12. **Run the release version**

bash
./target/release/my-actix-project


### Summary of the process:
1. Install Rust
2. Create a new project with cargo new
3. Add Actix dependencies
4. Build the project
5. Edit main.rs to add Actix code
6. Run the server with cargo run
7. Test with curl or browser
8. Add more functionality by editing main.rs
9. Optionally use cargo watch
10. Build for release with cargo build --release

This will guide you through a full cycle of developing an Actix web project!
`;
