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
		main.dart,f(e=C:\\ai\\fulled\\extensions\\fulled\\src\\commands\\directory_context\\aspnet_core.ts=BACA.md)
`;

export function register_dir_context_create_asp_net_core(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_asp_net_core`,
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
Here's a step-by-step guide to creating an ASP.NET Core project from start to finish, including the development activities:

### 1. **Install .NET SDK (if not already installed)**
	Make sure you have the .NET SDK installed. You can download it from:
	[Download .NET](https://dotnet.microsoft.com/download)

### 2. **Create a New ASP.NET Core Project**
	bash
	dotnet new webapp -n MyAspNetCoreApp

	This command creates a new ASP.NET Core web application named MyAspNetCoreApp.

### 3. **Navigate to the Project Directory**
	bash
	cd MyAspNetCoreApp


### 4. **Restore Dependencies**
	bash
	dotnet restore

	Restores any missing dependencies for the project.

### 5. **Run the Project (Development Server)**
	bash
	dotnet run

	Starts the development server. Open a browser and go to https://localhost:5001 (or the port specified) to view your project.

### 6. **Edit Program.cs and Startup.cs (for older versions) or Program.cs (for .NET 6 and later)**
	Open the Program.cs file and make necessary changes, such as configuring services or setting up middleware.

	> **Note:** In .NET 6+ (Minimal APIs), Startup.cs is merged into Program.cs.

	Example: Add middleware or routing logic.

### 7. **Edit appsettings.json for Configuration Settings**
	Update appsettings.json to include necessary configuration values, such as database connection strings, app settings, etc.

### 8. **Add Controllers or Pages**
	- For MVC-based applications, create controllers:
	  bash
	  mkdir Controllers
	  touch Controllers/HomeController.cs

	  Add logic for actions inside HomeController.cs.

	- For Razor Pages projects, create new Razor pages:
	  bash
	  mkdir Pages
	  touch Pages/Index.cshtml


### 9. **Install Required NuGet Packages (Optional)**
	If you need additional packages, you can install them using the following command:
	bash
	dotnet add package <PackageName>


	Example:
	bash
	dotnet add package Microsoft.EntityFrameworkCore.SqlServer


### 10. **Add Entity Framework Core (Optional)**
	If you're using Entity Framework Core, you'll need to install the necessary packages and set up the DbContext:

	- **Install EF Core tools:**
	  bash
	  dotnet tool install --global dotnet-ef


	- **Create the DbContext and models** in your project.

	- **Run EF Core Migrations (if using a database):**
	  bash
	  dotnet ef migrations add InitialCreate
	  dotnet ef database update


### 11. **Add Views (if using MVC)**
	- Create a Views folder and add Razor views.
	  bash
	  mkdir Views
	  mkdir Views/Home
	  touch Views/Home/Index.cshtml


	- Edit the view files (.cshtml) to display the desired output.

### 12. **Configure Routing (Optional)**
	If using MVC, update the routing logic in Program.cs (or Startup.cs for older versions).

	Example:
	csharp
	app.UseRouting();
	app.UseEndpoints(endpoints =>
	{
		 endpoints.MapControllerRoute(
			  name: "default",
			  pattern: "{controller=Home}/{action=Index}/{id?}");
	});


### 13. **Run Tests (if applicable)**
	If you have added unit tests or integration tests, you can run them with the following command:
	bash
	dotnet test


### 14. **Publish the Application (for deployment)**
	To publish the application for deployment, run:
	bash
	dotnet publish -c Release -o ./publish

	This will create a publish-ready version of your application in the ./publish directory.

### 15. **Deploy to a Server (Optional)**
	Depending on your deployment strategy (e.g., Docker, IIS, Linux server), follow the relevant steps to deploy your app.

---

This covers the key steps involved in creating and setting up a basic ASP.NET Core application from start to finish. Adjust these steps based on your project needs!
`;
