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

export function register_dir_context_create_scraping_playwright(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_playwright`,
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
Here’s a step-by-step list of commands and activities needed to create a web scraping and automation project using TypeScript and Playwright:

### 1. **Set up the project**
Start by creating a directory for your project and initializing a Node.js project.

bash
mkdir my-scraping-project
cd my-scraping-project
npm init -y


### 2. **Install necessary dependencies**
Install Playwright and TypeScript.

bash
npm install playwright
npm install typescript ts-node @types/node --save-dev


### 3. **Set up TypeScript configuration**
Initialize the TypeScript configuration file.

bash
npx tsc --init


Edit the tsconfig.json file to match your needs (like enabling esModuleInterop for Playwright).

### 4. **Install Playwright browsers**
This installs the required browser binaries for Playwright.

bash
npx playwright install


### 5. **Create the main TypeScript file**
Create a folder for your source files and add a new file for your Playwright script.

bash
mkdir src
touch src/scrape.ts


### 6. **<Editing main file>**: Implement scraping logic in scrape.ts
In your scrape.ts, start writing the Playwright automation script:

typescript
import { chromium } from 'playwright';

(async () => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://example.com');

	// Your scraping or automation logic goes here
	const content = await page.textContent('h1');
	console.log(content);

	await browser.close();
})();


### 7. **Run the script**
Use ts-node to run your TypeScript script directly.

bash
npx ts-node src/scrape.ts


### 8. **<Editing main file>**: Add error handling and refine scraping logic
As you refine the logic, you might need to handle errors, add wait times, interact with forms, and extract more complex data.

### 9. **Test Playwright scripts interactively (Optional)**
You can use Playwright’s code generation tool to test scripts interactively.

bash
npx playwright codegen https://example.com


This command will open a browser where you can perform actions that will be automatically translated into Playwright code.

### 10. **Run tests (Optional)**
You may want to run tests or assertions on the scraped data.

bash
npx playwright test


### 11. **Package for production (Optional)**
If you're deploying or sharing the project, you can compile your TypeScript to JavaScript.

bash
npx tsc


This will output the compiled files to the dist directory (you can configure the output directory in tsconfig.json).

### 12. **Run the compiled JavaScript**
After compiling, you can run the output files like any Node.js project.

bash
node dist/scrape.js


### 13. **<Optimize for deployment>** (Optional)
If you plan to deploy the project, consider setting environment variables, using Docker, or integrating it into a CI/CD pipeline.

### 14. **<Debugging and optimization>** (Optional)
Use debugging tools such as console.log, page.screenshot(), or browser.close() to refine and optimize the script.

This workflow covers all key steps from initializing a project to running and refining a Playwright automation project with TypeScript.
`;
