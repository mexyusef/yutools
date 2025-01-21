import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';

// ini dibaca oleh FMUS, cara baru tanpa harus buat fmus file
const main_go_literal = `
--% main.go
package main

import (
	"net/http"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// Basic route
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Welcome to the eCommerce app!")
	})

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
--#
`;

const cmd_start = `go mod init __VAR1__`;
const fmus_command = `.,d
	tidy.bat,f(n=go mod tidy)
	run.bat,f(n=go run main.go)
	main.go,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\go_echo.ts=main.go)
`;

export async function register_dir_context_create_go_gorilla(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_go_gorilla`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath)
			// const terminal = createNewTerminal(terminal_name, filePath);
			// terminal.sendText(`echo siap mulai bekerja go echo, dengan giat, dg echo`);

			// // const setelah_proses = await preprocessString(cmd_start) as string;
			// // Process the command, ensuring it's blocking by awaiting the input
			// const setelah_proses = await preprocessString(cmd_start);

			// input string harus terjadi sebelum pembuatan terminal

			// Isolating terminal creation and text sending after input processing
			const setelah_proses = await preprocessString(cmd_start);

			if (setelah_proses === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(`echo siap mulai bekerja go echo, dengan giat, dg echo`);
				// terminal.sendText(`apakah undefined => [${setelah_proses}]`); // jangan ada > di terminal
				terminal.sendText(setelah_proses);
				run_fmus_at_specific_dir(fmus_command, filePath);
				terminal.sendText(`dir *.bat`);
			}

		});
	context.subscriptions.push(disposable);
}
