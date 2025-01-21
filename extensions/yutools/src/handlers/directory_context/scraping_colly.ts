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

export function register_dir_context_create_scraping_colly(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_colly`,
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
To create a web scraping project using Go and the Colly library, here's a step-by-step list of commands and activities, from start to finish:

### 1. **Install Go**

First, make sure you have Go installed on your system. You can check your Go version using:

bash
go version


If Go is not installed, follow the instructions from [Go's official site](https://go.dev/doc/install).

---

### 2. **Create a New Go Module**

Navigate to your project directory and create a new Go module:

bash
mkdir my-colly-scraper
cd my-colly-scraper
go mod init github.com/yourusername/my-colly-scraper


---

### 3. **Install Colly**

Install the Colly package using the following command:

bash
go get -u github.com/gocolly/colly


---

### 4. **Create Main File**

Create a main.go file in your project directory:

bash
touch main.go


---

### 5. **Edit the main.go File**

Open and edit the main.go file to write the basic setup of your Colly web scraper:

bash
nano main.go


Here’s an example of a basic Colly scraper structure:

go
package main

import (
	"fmt"
	"log"

	"github.com/gocolly/colly"
)

func main() {
	// Create a new collector
	c := colly.NewCollector()

	// Define the scraping rules
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		fmt.Println("Found link:", link)
	})

	// Handle errors
	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong:", err)
	})

	// Visit the target website
	c.Visit("https://example.com")
}


---

### 6. **Run the Go File**

Once you've edited the file, run your Go program:

bash
go run main.go


---

### 7. **Add More Scraping Rules**

Edit the main.go file again to handle more elements (like text, images, etc.):

bash
nano main.go


Example: Scraping text from paragraph tags (<p>) or other HTML elements:

go
c.OnHTML("p", func(e *colly.HTMLElement) {
	fmt.Println("Paragraph text:", e.Text)
})


---

### 8. **Compile the Project**

Once your scraper is working as expected, you can compile it to an executable:

bash
go build -o my-colly-scraper


---

### 9. **Run the Compiled Binary**

Run your compiled binary to test the program:

bash
./my-colly-scraper


---

### 10. **Add Features (Optional)**

- **Concurrency**: Add support for scraping multiple pages at once by setting limits.

- **Error Handling**: Improve error handling mechanisms.

- **Data Export**: Save scraped data to a file, such as CSV or JSON.

Modify the main.go file as needed to add these features.

---

### 11. **Save Data to CSV/JSON**

Edit main.go to save the scraped data to a file. Example for CSV:

bash
nano main.go


Example code:

go
import (
	"encoding/csv"
	"os"
)

file, err := os.Create("output.csv")
if err != nil {
	log.Fatal(err)
}
defer file.Close()

writer := csv.NewWriter(file)
defer writer.Flush()

writer.Write([]string{"Link", "Text"})
c.OnHTML("a[href]", func(e *colly.HTMLElement) {
	writer.Write([]string{e.Attr("href"), e.Text})
})


---

### 12. **Test the Scraper**

Run the program again to check if it's working as expected:

bash
go run main.go


---

### 13. **Debugging**

If the program doesn’t behave as expected, use log statements to debug:

go
log.Println("Starting the scraping process")


---

### 14. **Refactoring**

Refactor your code into smaller functions or packages for better structure. This could involve creating new Go files or directories as needed.

---

### 15. **Version Control (Optional)**

If you're using Git, initialize a repository and commit your work:

bash
git init
git add .
git commit -m "Initial commit with basic Colly scraper"


Push to a remote repository if desired.

bash
git remote add origin <repository_url>
git push -u origin master


---

### 16. **Deploy the Scraper (Optional)**

If you want to deploy the scraper on a server or automate it, consider using a service like AWS, DigitalOcean, or even Cron jobs for periodic runs.

---

By following these steps, you should have a working Go/Colly scraper project. Let me know if you'd like details on any specific part of the process!

`;
