import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `django-admin startproject __VAR1__`;

const fmus_code_wrapper = `
--% BACA.md
dummy baca md
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		create-app.bat,f(n=python manage.py startapp %*)
		makemig.bat,f(n=python manage.py makemigrations)
		mig.bat,f(n=python manage.py migrate)
		su.bat,f(n=python manage.py createsuperuser)
		run.bat,f(n=python manage.py runserver)
		stat.bat,f(n=python manage.py collectstatic)
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_django(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_django`,
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
Here's a step-by-step guide, with both commands and development activities, to start a Django project from scratch to basic completion:

### 1. **Set up a Virtual Environment** (optional but recommended)
bash
# Create virtual environment
python -m venv env

# Activate virtual environment (Windows)
./env/Scripts/activate

# Activate virtual environment (Mac/Linux)
source env/bin/activate


### 2. **Install Django**
bash
pip install django


### 3. **Start a Django Project**
bash
# Start a new Django project
django-admin startproject <project_name>
cd <project_name>


### 4. **Run the Development Server**
bash
# Run the server to check if everything works fine
python manage.py runserver


### 5. **Edit the settings.py file**
	- Configure settings such as ALLOWED_HOSTS, DATABASES, STATIC_URL, and more.
	- Add installed apps and middleware if needed.

### 6. **Create a Django App**
bash
# Create a new app inside the project
python manage.py startapp <app_name>


### 7. **Edit the settings.py file again**
	- Add the app you created to the INSTALLED_APPS list:
	python
	INSTALLED_APPS = [
		 # other apps
		 '<app_name>',
	]


### 8. **Define Models in the App**
	- Edit <app_name>/models.py to define database models.

### 9. **Make Migrations**
bash
# Generate migration files based on the models
python manage.py makemigrations


### 10. **Apply Migrations**
bash
# Apply migrations to the database
python manage.py migrate


### 11. **Create Admin Superuser**
bash
# Create a superuser to access Django Admin
python manage.py createsuperuser


### 12. **Register Models in the Admin Interface**
	- Edit <app_name>/admin.py to register your models:
	python
	from .models import <YourModel>
	admin.site.register(<YourModel>)


### 13. **Create Views**
	- Edit <app_name>/views.py to define views that handle logic and return responses.

### 14. **Create URLs**
	- Edit <app_name>/urls.py to define app-specific routes.
	- Edit <project_name>/urls.py to include app-specific URLs:
	python
	from django.urls import path, include

	urlpatterns = [
		 # other paths
		 path('<app_name>/', include('<app_name>.urls')),
	]


### 15. **Create Templates**
	- In the app, create an templates/ directory and add HTML files.

### 16. **Configure Static Files**
	- In settings.py, set the STATIC_URL and configure the STATICFILES_DIRS:
	python
	STATIC_URL = '/static/'
	STATICFILES_DIRS = [BASE_DIR / 'static',]


### 17. **Run the Development Server Again**
bash
python manage.py runserver


### 18. **Test Your Project**

### 19. **Collect Static Files for Production**
bash
# Collect all static files in one directory
python manage.py collectstatic


### 20. **Deploy the Project (Optional)**
	- Configure the production environment settings (e.g., database, allowed hosts).
	- Set up a production server (e.g., Gunicorn, Nginx, or using a service like Heroku).

This covers the essential steps from starting a project to deploying it.

`;
