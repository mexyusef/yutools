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

export function register_dir_context_create_ruby_on_rails(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_ruby_on_rails`,
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
Here's a step-by-step guide for starting a new Ruby on Rails project, from setup to launch, including editing necessary files during the process:

### Step 1: **Install Ruby and Rails**
If you haven't installed Ruby and Rails yet, follow these steps:

1. Install Ruby (if not installed):
	bash
	rbenv install 3.2.2
	rbenv global 3.2.2


2. Install Rails:
	bash
	gem install rails


### Step 2: **Create a New Rails Project**
1. Create a new Rails project:
	bash
	rails new my_project_name


2. Move into the project directory:
	bash
	cd my_project_name


### Step 3: **Configure Database**
1. Open config/database.yml and configure your database (e.g., PostgreSQL, SQLite).

	Example for PostgreSQL:
	yaml
	default: &default
	  adapter: postgresql
	  encoding: unicode
	  username: postgres
	  password: your_password
	  host: localhost
	  pool: 5

	development:
	  <<: *default
	  database: my_project_name_development

	test:
	  <<: *default
	  database: my_project_name_test


2. Create the database:
	bash
	rails db:create


### Step 4: **Generate Models, Controllers, and Views**
1. Generate a model (example for User):
	bash
	rails generate model User name:string email:string


2. Generate a controller (example for Home):
	bash
	rails generate controller Home index


3. Migrate the database:
	bash
	rails db:migrate


### Step 5: **Edit Routes**
1. Open config/routes.rb and add a root route or other routes as needed:

	Example:
	ruby
	root 'home#index'


### Step 6: **Edit Controller and Views**
1. Open the controller you generated (app/controllers/home_controller.rb) and define actions.

2. Edit the view files in app/views/home/index.html.erb to customize the content.

### Step 7: **Setup Frontend (Optional)**
1. Install frontend dependencies (e.g., Webpacker or Tailwind CSS):
	bash
	rails webpacker:install
	rails webpacker:install:react # If using React


2. Customize CSS, JavaScript, or front-end libraries as needed.

### Step 8: **Add Gem Dependencies**
1. Open Gemfile and add any gems required for your project.

	Example:
	ruby
	gem 'devise' # for user authentication
	gem 'pundit' # for authorization


2. Install new dependencies:
	bash
	bundle install


### Step 9: **Setup Environment Variables**
1. Install dotenv-rails for environment variables in Gemfile:
	ruby
	gem 'dotenv-rails', groups: [:development, :test]


2. Create a .env file and add your variables:
	bash
	touch .env


	Example .env file:
	bash
	DATABASE_PASSWORD=your_password


3. Load environment variables in config/database.yml or other configurations.

### Step 10: **Run Rails Server**
1. Start the development server:
	bash
	rails server


2. Visit http://localhost:3000 in your browser.

### Step 11: **Add Tests**
1. Generate tests:
	bash
	rails generate rspec:install # if using RSpec


2. Write unit, integration, or feature tests for your models and controllers.

### Step 12: **Version Control**
1. Initialize a Git repository (if you haven’t already):
	bash
	git init


2. Commit your changes:
	bash
	git add .
	git commit -m "Initial commit"


### Step 13: **Deploy (Optional)**
1. Prepare for production (e.g., on Heroku):
	bash
	rails assets:precompile RAILS_ENV=production


2. Push to Heroku (example using Heroku CLI):
	bash
	heroku create
	git push heroku master
	heroku run rails db:migrate


### Step 14: **Continuous Improvement**
1. Add background jobs, API endpoints, WebSockets, etc., depending on project requirements.
2. Optimize for performance and security.

This process outlines the major steps involved in creating a modern Ruby on Rails application, including the necessary file edits and commands for development.
`;
