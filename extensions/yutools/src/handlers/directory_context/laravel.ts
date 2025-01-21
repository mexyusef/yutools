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

export function register_dir_context_create_laravel(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_laravel`,
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
Here’s a detailed step-by-step guide for starting a Laravel PHP project from start to finish, including both CLI commands and development activities:

### 1. **Install Laravel and Project Setup**
	 - Ensure you have [Composer](https://getcomposer.org/) and PHP installed.
	 - Install Laravel globally (if not already done):
		 bash
		 composer global require laravel/installer

	 - Create a new Laravel project:
		 bash
		 laravel new project-name

		 Or alternatively:
		 bash
		 composer create-project --prefer-dist laravel/laravel project-name


### 2. **Set Up Environment Configuration**
	 - Navigate into the project directory:
		 bash
		 cd project-name

	 - Copy the .env.example file to create a new .env file:
		 bash
		 cp .env.example .env

	 - Generate an application key:
		 bash
		 php artisan key:generate


### 3. **Configure Database**
	 - **Edit .env file**:
		 - Configure the database connection settings (DB_DATABASE, DB_USERNAME, DB_PASSWORD).
		 - Example:

			 DB_CONNECTION=mysql
			 DB_HOST=127.0.0.1
			 DB_PORT=3306
			 DB_DATABASE=your_database_name
			 DB_USERNAME=your_database_user
			 DB_PASSWORD=your_password


### 4. **Create Database & Migrate**
	 - **Create the database** in your preferred database tool (MySQL, PostgreSQL, etc.).
	 - Run migrations to set up your database tables:
		 bash
		 php artisan migrate


### 5. **Serve the Application**
	 - Start the development server:
		 bash
		 php artisan serve

	 - Visit the application in your browser at: http://localhost:8000

### 6. **Create Controllers, Models, and Routes**
	 - Create a new controller:
		 bash
		 php artisan make:controller ExampleController

	 - Create a new model:
		 bash
		 php artisan make:model ExampleModel

	 - **Edit routes/web.php**:
		 - Define the routes to access your controllers.
		 php
		 Route::get('/example', [ExampleController::class, 'index']);


### 7. **Blade Templates and Views**
	 - **Create view files** in the resources/views directory.
	 - Example: resources/views/welcome.blade.php
	 - **Edit blade template**:
		 php
		 <!DOCTYPE html>
		 <html>
		 <head>
				 <title>Laravel Project</title>
		 </head>
		 <body>
				 <h1>Welcome to Laravel</h1>
		 </body>
		 </html>


### 8. **Set Up Authentication (Optional)**
	 - Install Laravel Breeze or Laravel Jetstream for quick authentication scaffolding:
		 bash
		 composer require laravel/breeze --dev
		 php artisan breeze:install
		 npm install && npm run dev
		 php artisan migrate


### 9. **Install Frontend Dependencies**
	 - Install npm dependencies:
		 bash
		 npm install

	 - Compile assets:
		 bash
		 npm run dev

	 - **Edit resources/css and resources/js** as necessary to style and script your application.

### 10. **Seeder & Factory (Optional)**
	 - Create a seeder:
		 bash
		 php artisan make:seeder ExampleSeeder

	 - Run the seeder:
		 bash
		 php artisan db:seed


### 11. **Test Your Application**
	 - Run tests:
		 bash
		 php artisan test


### 12. **Version Control**
	 - **Initialize Git** if not already:
		 bash
		 git init

	 - **Add a .gitignore file** if needed, Laravel comes with one by default.
	 - Commit changes:
		 bash
		 git add .
		 git commit -m "Initial commit"


### 13. **Deploy to Production**
	 - Ensure .env settings are properly configured for the production environment.
	 - Optimize your application for production:
		 bash
		 php artisan config:cache
		 php artisan route:cache
		 php artisan view:cache


This guide outlines the key steps from creating a new Laravel project to deploying it. Let me know if you need more details for any step.
`;
