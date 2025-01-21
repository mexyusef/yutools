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

export function register_dir_context_create_go_fasthttp(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_go_fasthttp`, async (uri: vscode.Uri) => {
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
Here is a step-by-step list of commands and activities to start a **Go** project using the **fasthttp** library from start to finish, including development steps like editing files.

### 1. **Install Go**
Ensure Go is installed on your system. Verify by running:
bash
go version


If not installed, follow the instructions from the official Go website: https://golang.org/dl/

### 2. **Create a New Go Project**

Navigate to the directory where you want your project and create a new folder:
bash
mkdir my-fasthttp-project
cd my-fasthttp-project


### 3. **Initialize the Go Module**

Initialize a new Go module in the project directory:
bash
go mod init github.com/yourusername/my-fasthttp-project


### 4. **Install fasthttp Library**

Install the fasthttp library by running:
bash
go get -u github.com/valyala/fasthttp


### 5. **Create a main.go File**

Create the main.go file, which will contain the Go code:
bash
touch main.go


### 6. **Edit the main.go File**

Open the main.go file in your preferred editor and add a simple fasthttp server code.

go
package main

import (
	"github.com/valyala/fasthttp"
	"log"
)

func main() {
	requestHandler := func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/":
			ctx.Response.SetBody([]byte("Welcome to fasthttp!"))
		case "/hello":
			ctx.Response.SetBody([]byte("Hello, world!"))
		default:
			ctx.Error("Unsupported path", fasthttp.StatusNotFound)
		}
	}

	log.Println("Starting server on :8080")
	if err := fasthttp.ListenAndServe(":8080", requestHandler); err != nil {
		log.Fatalf("Error in ListenAndServe: %s", err)
	}
}


### 7. **Run the Server**

After saving your changes, run the server:
bash
go run main.go


The server should now be running on http://localhost:8080.

### 8. **Test the Server**

Open another terminal or use a browser to test the server:
bash
curl http://localhost:8080/
curl http://localhost:8080/hello


### 9. **(Optional) Build the Project**

To compile the Go project into a binary:
bash
go build -o my-fasthttp-server


### 10. **Run the Compiled Binary**

Once built, you can run the compiled binary:
bash
./my-fasthttp-server


### 11. **Set Up Version Control (Optional)**

Initialize a git repository if you want to version control your project:
bash
git init
git add .
git commit -m "Initial commit"


### 12. **Final Checks and Deployment**

- If you want to deploy the project, consider adding systemd service files, Docker configuration, or other deployment steps as needed.

---

This guide covers the basic steps for creating, developing, and testing a Go project using the **fasthttp** package. Let me know if you'd like details on any specific aspect like Dockerizing or scaling the app!
`;
