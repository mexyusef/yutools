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

export function register_dir_context_create_go_fiber(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_go_fiber`, async (uri: vscode.Uri) => {
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
To start a new Go project using the **Fiber** framework, you need to follow a series of steps, which include both CLI commands and development activities like editing files. Here's a step-by-step guide to starting a Go Fiber project:

### Step-by-Step Instructions:

1. **Install Go**
   If you haven't already, install Go from [https://golang.org/dl/](https://golang.org/dl/).

2. **Create a New Directory for Your Project**
   bash
   mkdir my-fiber-app
   cd my-fiber-app


3. **Initialize Go Module**
   This will create a go.mod file for dependency management.
   bash
   go mod init my-fiber-app


4. **Install Fiber Framework**
   Install Fiber using Go modules.
   bash
   go get github.com/gofiber/fiber/v2


5. **Create a main.go File**
   Create a new main.go file and open it in your preferred text editor.
   bash
   touch main.go


6. **<Editing main.go File>**
   Open the main.go file and edit it to include a basic Fiber setup.
   Example content:
   go
   package main

   import (
	   "github.com/gofiber/fiber/v2"
   )

   func main() {
	   app := fiber.New()

	   app.Get("/", func(c *fiber.Ctx) error {
		   return c.SendString("Hello, World!")
	   })

	   app.Listen(":3000")
   }


7. **Run the Go Fiber Application**
   After editing the main.go file, run the application.
   bash
   go run main.go


8. **Test the Application**
   Open a browser or use curl to test the app by visiting http://localhost:3000. You should see "Hello, World!" as the output.

   bash
   curl http://localhost:3000


9. **Install a Router Middleware (Optional)**
   If you need more advanced routing, you can install the fiber/v2/middleware package for Fiber.
   bash
   go get github.com/gofiber/fiber/v2/middleware


10. **<Add Middleware and Routes>**
	You can now edit the main.go file to include middlewares and additional routes. Example:
	go
	app.Use(func(c *fiber.Ctx) error {
		println("Request Received")
		return c.Next()
	})

	app.Get("/about", func(c *fiber.Ctx) error {
		return c.SendString("About Page")
	})


11. **Run the Application Again**
	bash
	go run main.go


12. **Build the Application for Production**
	If you want to compile your Go app to a binary for production:
	bash
	go build


13. **Run the Binary**
	After building, run the binary file directly:
	bash
	./my-fiber-app


14. **<Deploy the Application>**
	Deploy the binary to your server or cloud environment.

---

These are the key steps to go from setting up the project to running it locally. Feel free to add more as your project grows!
`;
