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

export function register_dir_context_create_scraping_cheerio(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_cheerio`,
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
Here's a step-by-step guide to start a scraping and automation project using TypeScript and Cheerio:

### 1. **Initialize the project**
	bash
	mkdir my-scraping-project
	cd my-scraping-project
	npm init -y


### 2. **Install TypeScript**
	bash
	npm install typescript --save-dev


### 3. **Set up TypeScript configuration (tsconfig.json)**
	bash
	npx tsc --init


### 4. **Install necessary dependencies**
	- Install **Cheerio** for HTML parsing and **Axios** for HTTP requests:
	bash
	npm install axios cheerio


	- Install **Node.js** types and **ts-node** for running TypeScript files directly:
	bash
	npm install @types/node ts-node --save-dev


### 5. **Install any additional types for libraries**
	bash
	npm install @types/cheerio --save-dev


### 6. **<Editing main file> (e.g., src/index.ts)**
	- Create a folder src and start coding in src/index.ts. Here's an example:
	typescript
	import axios from 'axios';
	import * as cheerio from 'cheerio';

	async function scrapeWebsite(url: string) {
	  try {
		 const { data } = await axios.get(url);
		 const $ = cheerio.load(data);

		 // Example of scraping a title
		 const title = $('title').text();
		 console.log(Title of the page: title);
	  } catch (error: any) {
		 console.error(Error occurred: error);
	  }
	}

	scrapeWebsite('https://example.com');


### 7. **Run the project**
	bash
	npx ts-node src/index.ts


### 8. **<Add error handling or enhancements>**
	- If necessary, add retry mechanisms, data cleaning, or even headless browser automation (with Puppeteer if needed).

### 9. **Compile TypeScript to JavaScript**
	bash
	npx tsc


### 10. **Run compiled JavaScript**
	bash
	node dist/index.js


### 11. **<Deploy or automate>**
	- Optionally, set up a cron job or deploy your script on a cloud service (like AWS Lambda) if you want automated scraping.

---

This should give you the basic structure of a TypeScript + Cheerio project from initialization to execution!
`;
