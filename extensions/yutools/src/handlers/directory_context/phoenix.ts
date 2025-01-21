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

export function register_dir_context_create_phoenix(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_phoenix`,
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
Here’s a step-by-step list of commands and activities for creating a Phoenix project in Elixir from start to finish, including non-CLI activities like editing files.

1. **Install Elixir & Phoenix dependencies (if not already installed)**
	- Install Elixir:
	  bash
	  brew install elixir  # (for macOS)
	  apt-get install elixir  # (for Ubuntu)

	- Install Hex (Elixir package manager):
	  bash
	  mix local.hex

	- Install Phoenix:
	  bash
	  mix archive.install hex phx_new

	- Install Node.js (for asset management):
	  bash
	  brew install node  # (for macOS)
	  apt install nodejs  # (for Ubuntu)


2. **Generate a new Phoenix project**
	bash
	mix phx.new my_app


3. **Change directory to your new project**
	bash
	cd my_app


4. **Install dependencies**
	bash
	mix deps.get
	npm install --prefix assets


5. **Configure the database (if using PostgreSQL, for example)**
	- Edit config/dev.exs to update the database credentials:
	  elixir
	  config :my_app, MyApp.Repo,
		username: "postgres",
		password: "postgres",
		database: "my_app_dev",
		hostname: "localhost",
		show_sensitive_data_on_connection_error: true,
		pool_size: 10


6. **Create and migrate the database**
	bash
	mix ecto.create
	mix ecto.migrate


7. **Start the Phoenix server**
	bash
	mix phx.server


8. **Open the browser and navigate to** [http://localhost:4000](http://localhost:4000) to see your app in action.

9. **Editing main files (e.g., controllers, views, templates)**
	- Start by editing files in the lib/my_app_web directory:
	  - lib/my_app_web/controllers/
	  - lib/my_app_web/views/
	  - lib/my_app_web/templates/

10. **Create new database migrations (when required)**
	bash
	mix ecto.gen.migration add_some_table


11. **Run database migrations**
	bash
	mix ecto.migrate


12. **Generate a new context, schema, and migrations for a resource (e.g., user)**
	bash
	mix phx.gen.context Accounts User users name:string email:string


13. **Generate HTML CRUD for a resource (if applicable)**
	bash
	mix phx.gen.html Accounts User users name:string email:string


14. **Generate a new controller for custom routes**
	bash
	mix phx.gen.controller SomeController index show


15. **Update your router with new routes**
	- Edit lib/my_app_web/router.ex to define new routes.

16. **Run tests**
	bash
	mix test


17. **Compile your application**
	bash
	mix compile


18. **Assets management**
	- Edit and work on front-end assets (CSS/JavaScript) in the assets/ folder.
	- Rebuild assets:
	  bash
	  npm run deploy --prefix assets


19. **Release the application**
	- Build a release:
	  bash
	  mix phx.digest
	  MIX_ENV=prod mix release


20. **Deploy to a server (if applicable)**
	- SCP the built release to your server and run it.

21. **Start the production server**
	bash
	_build/prod/rel/my_app/bin/my_app start


This list covers the essential CLI commands and development activities in a Phoenix Elixir project from start to finish!
`;
