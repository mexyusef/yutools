import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
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

export function register_dir_context_create_go_gin(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_go_gin`,
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
To start and complete a Golang Gin project, follow this step-by-step process from setup to development. The process includes CLI commands as well as essential development tasks such as editing files.

### 1. **Initialize the Go Project**
	bash
	mkdir my-gin-app
	cd my-gin-app
	go mod init my-gin-app


### 2. **Install the Gin Framework**
	bash
	go get github.com/gin-gonic/gin


### 3. **Create the Main Go File**
	bash
	touch main.go


### 4. **Edit the main.go File**
	Open the main.go file in your editor and add a basic Gin setup.

	go
	package main

	import (
		 "github.com/gin-gonic/gin"
	)

	func main() {
		 r := gin.Default()
		 r.GET("/", func(c *gin.Context) {
			  c.JSON(200, gin.H{
					"message": "Hello, World!",
			  })
		 })
		 r.Run() // Run on default port 8080
	}


### 5. **Run the Go Application**
	bash
	go run main.go


### 6. **Test the API Endpoint**
	Open your browser or use curl to test the API.
	bash
	curl http://localhost:8080/


### 7. **Create Additional Routes (Optional)**
	Edit main.go to add more routes for different functionality.
	go
	r.GET("/ping", func(c *gin.Context) {
		 c.JSON(200, gin.H{
			  "message": "pong",
		 })
	})


### 8. **Install Go Linter & Formatter (Optional but Recommended)**
	bash
	go install golang.org/x/lint/golint@latest


### 9. **Build the Go Application**
	If you're ready to build the project for deployment:
	bash
	go build -o my-gin-app


### 10. **Run the Compiled Application**
	bash
	./my-gin-app


### 11. **Create a .gitignore File (Optional)**
	bash
	touch .gitignore

	Add common Go exclusions like my-gin-app, *.exe, and *.log.

### 12. **Edit Environment Variables (Optional)**
	If you need to set environment variables, create a .env file and load them within main.go.

### 13. **Setup a Config File (Optional)**
	You can set up configurations by creating config.yaml or config.json to handle different environments (dev, prod).

### 14. **Run Tests (Optional)**
	Create test files and run tests.
	bash
	go test ./...


### 15. **Version Control**
	If using Git, initialize and commit your code:
	bash
	git init
	git add .
	git commit -m "Initial commit"


This will help you get started, build, and manage your Gin-based Go web application from the ground up.

`;
