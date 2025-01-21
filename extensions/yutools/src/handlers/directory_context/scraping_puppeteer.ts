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

export function register_dir_context_create_scraping_puppeteer(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_puppeteer`,
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
Here's a step-by-step guide on how to start a scraping and automation project with **TypeScript** and **Puppeteer**, from start to finish. I'll include both CLI commands and development activities that need to be performed manually, like editing files.

### 1. **Set Up Your Project Directory**
bash
mkdir puppeteer-typescript-scraper
cd puppeteer-typescript-scraper


### 2. **Initialize Node.js Project**
bash
npm init -y


### 3. **Install Dependencies**
- Install Puppeteer, TypeScript, and other necessary tools.
bash
npm install puppeteer
npm install typescript @types/node @types/puppeteer ts-node


### 4. **Initialize TypeScript Configuration**
bash
npx tsc --init

This will generate a tsconfig.json file. You can edit this file if necessary to customize TypeScript settings (like target version, module resolution, etc.).

### 5. **Create Project Structure**
bash
mkdir src
touch src/index.ts


### 6. **Edit src/index.ts File**
Manually edit the src/index.ts file. You can start by adding a basic Puppeteer setup:

typescript
import puppeteer from 'puppeteer';

async function scrape() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://example.com');

	// Example of scraping: Get the title of the page
	const title = await page.title();
	console.log('Page title:', title);

	await browser.close();
}

scrape();


### 7. **Add Scripts to package.json**
Edit the package.json file to add a script for running your TypeScript code.

json
"scripts": {
	"start": "ts-node src/index.ts"
}


### 8. **Run the Scraper**
bash
npm start


### 9. **Compile TypeScript to JavaScript (Optional)**
If you want to compile TypeScript to JavaScript and run the compiled version, use:
bash
npx tsc
node dist/index.js


### 10. **Edit the Scraping Logic (src/index.ts)**
Continue modifying the src/index.ts file to include more advanced scraping and automation logic, such as:
- Filling forms.
- Taking screenshots.
- Navigating multiple pages.
- Handling authentication, etc.

For example, to capture a screenshot:
typescript
await page.screenshot({ path: 'example.png' });


### 11. **Handle Browser Automation Tasks**
You can add tasks like filling out forms, clicking buttons, etc.

typescript
await page.type('#username', 'myUsername');
await page.click('#submit-button');


### 12. **Debugging**
- Add error handling and debugging steps.
- Consider adding a .env file and using the dotenv package for sensitive information (e.g., credentials).

Install dotenv:
bash
npm install dotenv

And load environment variables in index.ts:
typescript
import 'dotenv/config';


### 13. **Run in Headless/Non-Headless Mode**
You can toggle between headless or non-headless modes to observe what the browser is doing.

typescript
const browser = await puppeteer.launch({ headless: false });


### 14. **Optimize and Refine the Scraping Logic**
- Refactor your code into multiple files for better organization.
- Add retry mechanisms in case of errors.
- Implement waits, such as:
typescript
await page.waitForSelector('selector');


### 15. **Final Testing and Deployment**
- Test the script in various environments.
- If deploying to a server, consider using tools like **PM2** to run the scraper in the background.

### 16. **Optional: Create Build and Run Scripts**
Create a build script to simplify TypeScript compilation and running the app:
json
"scripts": {
	"build": "tsc",
	"start": "node dist/index.js"
}


Run the build:
bash
npm run build
npm start


### 17. **Optional: Add Linter and Prettier for Code Quality**
bash
npm install --save-dev eslint prettier
npx eslint --init


### Summary
1. Create the project directory and initialize npm.
2. Install Puppeteer and TypeScript dependencies.
3. Set up TypeScript config (tsconfig.json).
4. Create the src/index.ts file and start coding.
5. Run the script using npm start.
6. Refine and test the scraping logic.

This will guide you through the entire process of setting up and running a TypeScript-based Puppeteer project for web scraping and automation.
`;
