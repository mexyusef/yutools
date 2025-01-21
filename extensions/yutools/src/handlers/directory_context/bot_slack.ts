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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\bot_slack.ts=BACA.md)
`;

export function register_dir_context_create_bot_slack(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_bot_slack`,
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
Here’s a step-by-step guide with commands and actions to help you build a Slack bot using Python from start to finish:

### 1. **Set up a virtual environment**
	Create a Python virtual environment to keep your dependencies isolated.

	bash
	mkdir slack-bot
	cd slack-bot
	python3 -m venv venv
	source venv/bin/activate


### 2. **Install Slack SDK**
	Install the Slack SDK for Python and any other necessary dependencies.

	bash
	pip install slack_sdk
	pip install python-dotenv  # For loading environment variables


### 3. **Create Slack app on Slack**
	- Go to the [Slack API Dashboard](https://api.slack.com/apps) and create a new app.
	- Choose the "From scratch" option.
	- Set scopes (like chat:write, commands, users:read, etc.) in OAuth & Permissions.
	- Install the app to your workspace and grab the OAuth token and signing secret.

### 4. **Create .env file**
	Create a .env file to store sensitive information like OAuth token and signing secret.

	**Action (not a command)**
	bash
	touch .env

	**Add to .env**:

	SLACK_BOT_TOKEN=<your-slack-bot-token>
	SLACK_SIGNING_SECRET=<your-slack-signing-secret>


### 5. **Initialize main Python file**
	Create your main Python file where you will write your bot logic.

	bash
	touch bot.py


### 6. **Editing bot.py**
	Open and edit bot.py to add initial code for your Slack bot.

	**Action (not a command)**: Open bot.py in your favorite editor and add the following code to initialize the Slack client:

	python
	import os
	from slack_sdk import WebClient
	from slack_sdk.errors import SlackApiError
	from dotenv import load_dotenv

	load_dotenv()

	client = WebClient(token=os.getenv("SLACK_BOT_TOKEN"))

	try:
		 response = client.chat_postMessage(channel='#general', text="Hello, world!")
		 assert response["message"]["text"] == "Hello, world!"
	except SlackApiError as e:
		 print(f"Error posting message: {e.response['error']}")


### 7. **Test your bot**
	Run the script to test that your bot can post messages to Slack.

	bash
	python bot.py


### 8. **Set up event handling with Flask**
	Install Flask for handling Slack events (optional but common).

	bash
	pip install Flask


### 9. **Editing bot.py to handle events**
	Add Flask to the bot to handle events like messages or commands from Slack.

	**Action (not a command)**: Modify bot.py to include an event handler using Flask.

	python
	from flask import Flask, request, jsonify
	import hashlib
	import hmac

	app = Flask(__name__)

	@app.route("/slack/events", methods=["POST"])
	def slack_events():
		 # Handle Slack event verification
		 return jsonify({"status": "success"})

	if __name__ == "__main__":
		 app.run(port=3000)


### 10. **Run the Flask server**
	Test the Flask server locally to listen to Slack events.

	bash
	python bot.py


### 11. **Create a tunnel (using ngrok)**
	You need to expose your local server to the internet so Slack can send events.

	bash
	ngrok http 3000


	- Copy the public URL provided by ngrok and use it in your Slack app under **Event Subscriptions** and **Slash Commands**.

### 12. **Add more bot functionality**
	Continue editing bot.py to add more functionalities like responding to specific commands or processing Slack events.

	**Action (not a command)**: Expand your bot logic based on your needs.

### 13. **Deploy your bot**
	Once you're done testing locally, you can deploy your bot to a platform like Heroku, AWS, etc.

	Example (for Heroku):
	bash
	heroku login
	heroku create your-app-name
	git init
	git add .
	git commit -m "Initial commit"
	heroku git:remote -a your-app-name
	git push heroku master


### 14. **Monitor and test in production**
	Check Slack logs and test the bot in your workspace to ensure it's working correctly.

---

By following these steps and using these commands, you will have a working Slack bot project from start to finish.

`;
