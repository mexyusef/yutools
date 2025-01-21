import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { createNewTerminal } from '../terminal';


const cmd1 = `nest new .`;

const cmd2 = `npm install @nestjs/typeorm typeorm mysql2 && npm install @nestjs/passport passport passport-local && npm install @nestjs/jwt passport-jwt && npm install class-validator class-transformer`;

const command_v1 = `${cmd1} && ${cmd2}`;

const fmus1 = `
.,d
	src,d
		auth,d
			auth.controller.ts
			auth.module.ts
			auth.service.ts
			jwt.strategy.ts
			local.strategy.ts
		config,d
			typeorm.config.ts
			jwt.config.ts
		orders,d
			order.entity.ts
			orders.controller.ts
			orders.module.ts
			orders.service.ts
		products,d
			product.entity.ts
			products.controller.ts
			products.module.ts
			products.service.ts
		users,d
			user.entity.ts
			users.controller.ts
			users.module.ts
			users.service.ts
		app.module.ts
		main.ts
	test,d
		app.e2e-spec.ts
	.env
	package.json
`

export function register_dir_context_nest_create(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_nest_create`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		const terminal_name = getBasename(filePath)
		const terminal = createNewTerminal(terminal_name, filePath);
		terminal.sendText(command_v1);
		// terminal.sendText(command_03);
		// run_fmus_at_specific_dir(fmus_command, filePath);
	});
	context.subscriptions.push(disposable);
}
