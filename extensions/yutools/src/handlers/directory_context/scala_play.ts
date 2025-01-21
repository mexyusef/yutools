import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';

const command_v1 = `sbt new playframework/play-scala-seed.g8`;

const fmus_code_wrapper = `
--% BACA.md
Editing main application files
Now, you can start editing the main source files. These typically include:

conf/routes: Define routes between HTTP requests and application logic.
GET     /                    controllers.HomeController.index

app/controllers/HomeController.scala: The default controller where you can add actions for different routes.
def index = Action { implicit request: Request[AnyContent] =>
  Ok(views.html.index())
}

app/views/index.scala.html
@(message: String)

@main("Welcome to Play") {
  <h1>@message</h1>
}

app/views/main.scala.html: The default view file for displaying HTML.


target/universal/<project-name>-<version>/bin/<project-name> -Dplay.http.secret.key="<secret>"

Dockerfile:
docker build -t <image-name> .
docker run -p 9000:9000 <image-name>
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		run.bat,f(n=sbt run)
		test.bat,f(n=sbt test)
		rilis.bat,f(n=sbt dist)
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\scala_play.ts=BACA.md)
`;

export function register_dir_context_scala_play(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.dir_context_scala_play`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath)

			// yg berisi __VAR1__ adlh fmus command, kita masukkan input via vscode
			const result_map = await processCommandWithMap(fmus_command);
			// nanti command sbt minta nama folder, jadi kita masukkan nilai input yg sama 2x: vscode dan terminal
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {

				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);

				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(command_v1);

				const fmus_command_replaced = result_map.result; // fmus berisi __VAR1__ pertama, jadi ambil nilai replacement pertama
				run_fmus_at_specific_dir(fmus_command_replaced, filePath); // create *.bat etc
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}
		});
	context.subscriptions.push(disposable);
}
