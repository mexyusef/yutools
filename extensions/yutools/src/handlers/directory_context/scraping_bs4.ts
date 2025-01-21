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

export function register_dir_context_create_scraping_bs4(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_bs4`,
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
Here's a step-by-step guide to starting a web scraping project using **BeautifulSoup4** from start to finish, including key CLI commands and development activities:

1. **Create a virtual environment** (optional but recommended):
	bash
	python -m venv myenv

	Activate the virtual environment:
	- On Windows:
	  bash
	  myenv\\Scripts\\activate

	- On macOS/Linux:
	  bash
	  source myenv/bin/activate


2. **Install required libraries**:
	bash
	pip install beautifulsoup4 requests


3. **Set up the project folder**:
	bash
	mkdir scraping_project
	cd scraping_project


4. **Create the main Python file**:
	bash
	touch main.py


5. **Editing the main file** (not a CLI command, but a key step):
	- Open main.py in a text editor and add basic scraping code:
	  python
	  import requests
	  from bs4 import BeautifulSoup

	  # Step 1: Send an HTTP request to the website
	  url = 'https://example.com'
	  response = requests.get(url)

	  # Step 2: Parse the page content with BeautifulSoup
	  soup = BeautifulSoup(response.text, 'html.parser')

	  # Step 3: Find the desired data
	  data = soup.find_all('tag_name')  # Replace 'tag_name' with the actual tag you're interested in

	  # Step 4: Print or process the extracted data
	  for item in data:
			print(item.text)


6. **Run the script to test it**:
	bash
	python main.py


7. **Handle exceptions (Optional)**:
	- Modify main.py to add exception handling for errors such as connection issues.
	  python
	  try:
			response = requests.get(url)
			response.raise_for_status()  # Check for HTTP errors
	  except requests.exceptions.RequestException as e:
			print(f"Error occurred: {e}")


8. **Install additional tools (Optional)**:
	- For better control of scraping or automation, you can install other libraries like **lxml**, **selenium**, or **pandas**:
	  bash
	  pip install lxml selenium pandas


9. **Modify the script to handle dynamic content** (if needed):
	- If the page is dynamically loaded (e.g., using JavaScript), switch to **Selenium** or use browser automation tools:
	  python
	  from selenium import webdriver

	  # Selenium example to load the page
	  driver = webdriver.Chrome()  # Make sure to download the proper ChromeDriver
	  driver.get('https://example.com')

	  # Get the page source and parse with BeautifulSoup
	  soup = BeautifulSoup(driver.page_source, 'html.parser')


10. **Export data to a file** (Optional):
	 - You may want to save the scraped data to a CSV or JSON file:
		python
		import csv

		with open('output.csv', 'w', newline='', encoding='utf-8') as file:
			 writer = csv.writer(file)
			 writer.writerow(['Column1', 'Column2'])  # Add headers
			 for item in data:
				  writer.writerow([item.text])  # Add scraped data


11. **Run the final script**:
	 bash
	 python main.py


12. **Deactivate the virtual environment** (when done):
	 bash
	 deactivate


These steps will guide you through setting up, developing, and running your web scraping project using BeautifulSoup4.

`;
