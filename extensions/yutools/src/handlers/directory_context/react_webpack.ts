import * as vscode from 'vscode';
// import * as fs from 'fs';
// import * as path from 'path';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { createNewTerminal } from '../terminal';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
// import { getBasename } from '../../vsutils/file_dir';
// import { createNewTerminal } from '../../vsutils/terminal';
// import { run_fmus_at_specific_dir } from '../../vsutils/fmus_ketik';

const command_v1 = `npm init -y && npm install react react-dom webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin --save-dev`;
const command_v2 = `npm init -y && npm install react react-dom && npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin`;

const command_v3 = `npm init -y && npm install react react-dom && npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin && npm install --save-dev ts-loader @types/react @types/react-dom`;

const command_02 = `mkdir src && touch src/index.js src/App.js && touch webpack.config.js .babelrc index.html`;
const command_03 = `mkdir src && touch src/index.tsx src/App.tsx && touch webpack.config.js .babelrc index.html`;

const fmus_command = `.,d
	%FILE_SUMBER=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_webpack.fmus
	%HTML_TITLE=My Automatic React App
	index.html,f(e=FILE_SUMBER=index.html)
	webpack.config.js,f(e=FILE_SUMBER=webpack.config.js/02)
	.babelrc,f(e=FILE_SUMBER=.babelrc)
	tsconfig.json,f(e=FILE_SUMBER=tsconfig.json)
	src,d
		index.tsx,f(e=FILE_SUMBER=index.tsx)
		App.tsx,f(e=FILE_SUMBER=App.tsx)
	BACA.md,f(e=FILE_SUMBER=BACA.md)
	run.bat,f(n=npm run start)
`;

// const command_03 = `npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader html-webpack-plugin webpack webpack-cli webpack-dev-server`;

export function register_dir_context_react_webpack_create(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_react_webpack_create`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		// buka terminal baru
		// jika bisa exec command langsung akan preferable
		// run fmus???

		// sendCommandsToTerminal();
		// const terminal = vscode.window.createTerminal({ name: "CMD", shellPath: 'cmd.exe' });
		// terminal.show();
		const terminal_name = getBasename(filePath);
		const terminal = createNewTerminal(terminal_name, filePath);
		terminal.sendText(command_v3);
		// terminal.sendText(command_03);
		run_fmus_at_specific_dir(fmus_command, filePath);
	});
	context.subscriptions.push(disposable);
}
