import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { createNewTerminal } from '../terminal';
import { run_fmus_at_specific_dir } from '../fmus_ketik';


const cmd_start = `spring init --dependencies=web,data-jpa,mysql,security --groupId=com.example --artifactId=ecommerce-app --name=EcommerceApp --description="E-commerce application" --package-name=com.example.ecommerce ecommerce-app`;

const cmd_install = `./mvnw clean install`;
const cmd_run = `./mvnw spring-boot:run`;
const fmus_command = `.,d
	%FOLDER_PROYEK=ecommerce-app
	FOLDER_PROYEK,d
		install.bat,f(n=mvnw clean install)
		run.bat,f(n=mvnw spring-boot:run)
`;

export function register_dir_context_create_spring_boot(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_create_spring_boot`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		const terminal_name = getBasename(filePath)
		const terminal = createNewTerminal(terminal_name, filePath);
		terminal.sendText(cmd_start);
		// terminal.sendText(command_03);
		run_fmus_at_specific_dir(fmus_command, filePath);
	});
	context.subscriptions.push(disposable);
}
