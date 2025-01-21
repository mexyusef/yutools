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

export function register_dir_context_create_scraping_goquery(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_scraping_goquery`,
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
Here is a step-by-step guide on how to start and build a web scraping project using **Golang** and **Goquery** from start to finish, including the key development activities and commands:

### 1. **Set Up Project**

- **Create a New Project Directory:**
	bash
	mkdir go-scraper
	cd go-scraper


- **Initialize a New Go Module:**
	bash
	go mod init go-scraper


### 2. **Install Required Dependencies**

- **Install Goquery:**
	bash
	go get github.com/PuerkitoBio/goquery


- **Optional: Install HTTP Package (if needed for custom requests):**
	bash
	go get github.com/go-resty/resty/v2


### 3. **Set Up the Main File**

- **Create a main.go File:**
	bash
	touch main.go


### 4. **Edit the main.go File**

- Open the main.go file in your preferred editor and write the basic Go program structure:

go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/PuerkitoBio/goquery"
)

func main() {
	// Request the HTML page.
	res, err := http.Get("https://example.com")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	// Check for successful request
	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Use goquery to find and print elements
	doc.Find("h1").Each(func(i int, s *goquery.Selection) {
		title := s.Text()
		fmt.Printf("Title %d: %s\n", i, title)
	})
}


### 5. **Run the Program**

- **Run the Go Program:**
	bash
	go run main.go


### 6. **Refine the Scraping Logic**

- **Edit the main.go file to handle more complex scenarios:**
	- Extract other elements (e.g., links, paragraphs, images).
	- Handle pagination or load more dynamic pages.
	- Store the scraped data (CSV, database, etc.).

Example modifications:

go
doc.Find(".article").Each(func(i int, s *goquery.Selection) {
	title := s.Find("h1").Text()
	link, _ := s.Find("a").Attr("href")
	fmt.Printf("Article %d: %s - %s\n", i, title, link)
})


### 7. **Test and Debug**

- **Run the Program and Observe Output:**
	bash
	go run main.go


- **Optional: Install and Use golangci-lint for Code Linting (for better code quality):**
	bash
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	golangci-lint run


### 8. **Build the Project**

- **Compile the Go Program:**
	bash
	go build


- This will generate an executable file in your directory.

### 9. **Run the Compiled Program**

- **Execute the Binary:**
	bash
	./go-scraper


### 10. **Save Output to a File**

- **Modify main.go to write scraped data to a file, if necessary:**

go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/PuerkitoBio/goquery"
)

func main() {
	file, err := os.Create("output.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	res, err := http.Get("https://example.com")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find("h1").Each(func(i int, s *goquery.Selection) {
		title := s.Text()
		fmt.Fprintf(file, "Title %d: %s\n", i, title)
	})
}


- **Run the Updated Program and Check the output.txt File:**
	bash
	go run main.go


### 11. **Handling Errors and Improving Robustness**

- You can further edit main.go to include error handling, retries for failed HTTP requests, etc.

### 12. **Version Control (Optional)**

- **Initialize a Git Repository:**
	bash
	git init


- **Add and Commit Files:**
	bash
	git add .
	git commit -m "Initial scraper implementation"


---

This is the full sequence of activities and commands you can follow to develop a web scraper using **Golang** and **Goquery** from scratch to finish.

`;
