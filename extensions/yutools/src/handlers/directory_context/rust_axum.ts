import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `cargo new __VAR1__`;

const fmus_code_wrapper = `
--% add to Cargo.toml
[dependencies]
axum = "0.6"
tokio = { version = "1", features = ["full"] }
--#

--% utama.rs
use axum::{
	routing::get,
	Router,
};
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
	// Initialize tracing (useful for logging and debugging).
	tracing_subscriber::registry()
		.with(tracing_subscriber::fmt::layer())
		.init();

	// Build our application with a single route.
	let app = Router::new()
		.route("/", get(handler))
		.layer(
			ServiceBuilder::new()
				.layer(TraceLayer::new_for_http()), // Add logging for requests/responses
		);

	// Define the address to bind the server to.
	let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
	println!("Listening on {}", addr);

	// Start the Axum server.
	axum::Server::bind(&addr)
		.serve(app.into_make_service())
		.await
		.unwrap();
}

// Basic handler function that returns a static string.
async fn handler() -> &'static str {
	"Hello, World!"
}
--#
`;
const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	__VAR1__,d
		src,d
			utama.rs,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\rust_axum.ts=utama.rs)
		run.bat,f(n=cargo run)
		buat.bat,f(n=cargo build)
		rilis.bat,f(n=cargo build --release)
		format.bat,f(n=cargo fmt)
		check.bat,f(n=cargo clippy)
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\rust_axum.ts=add to Cargo.toml)
`;

export function register_dir_context_rust_axum(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.dir_context_rust_axum`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath)

			const result_map = await processCommandWithMap(command_v1);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);

				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(result_map.result); // cargo new
				// terminal.sendText(applyReplacements(`cd __VAR1__ && npm i`, result_map.map)); // npm install
				// apply to fmus_command
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map); // replace __VAR1__
				// console.log('New FMUS Command:', fmus_command_replaced);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath); // create *.bat etc
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}
		});
	context.subscriptions.push(disposable);
}
