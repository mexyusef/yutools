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

export function register_dir_context_create_scraping_scrapy(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_scrapy`,
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
Here’s a step-by-step list of commands and actions to create and run a web scraping project using Scrapy:

### 1. **Install Scrapy (if not installed)**
	bash
	pip install scrapy


### 2. **Start a New Scrapy Project**
	bash
	scrapy startproject <project_name>


### 3. **Navigate to the Project Directory**
	bash
	cd <project_name>


### 4. **Generate a New Spider**
	bash
	scrapy genspider <spider_name> <domain>


### 5. **Edit the Spider File**
	- File location: <project_name>/<project_name>/spiders/<spider_name>.py
	- Modify the spider file to define how to crawl the site and extract data.

### 6. **Edit the items.py File** (optional, if you need structured items)
	- Define the structure of the data to be extracted (optional).
	- File location: <project_name>/<project_name>/items.py

### 7. **Edit the middlewares.py, pipelines.py, or settings.py Files**
	- These files allow for further configuration of the spider (e.g., handling requests, managing output, obeying robots.txt, etc.).
	- File locations:
	  - Middlewares: <project_name>/<project_name>/middlewares.py
	  - Pipelines: <project_name>/<project_name>/pipelines.py
	  - Settings: <project_name>/<project_name>/settings.py

### 8. **Run the Spider**
	bash
	scrapy crawl <spider_name>


### 9. **Store Output in a File (Optional)**
	- Store data in various formats such as JSON, CSV, etc.
	bash
	scrapy crawl <spider_name> -o output.json


### 10. **Testing and Debugging**
	- Use Scrapy's shell to test XPath/CSS selectors:
	  bash
	  scrapy shell <URL>


### 11. **Refine Spider Logic**
	- Continue editing spider, items, pipelines, and other components to refine the scraping process.

### 12. **Deploy the Spider (Optional)**
	- Deploy to a scraping hub or run on a scheduled basis.
	bash
	scrapy deploy


These steps will guide you through creating a Scrapy project, from setup to execution.

`;
