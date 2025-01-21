import * as vscode from "vscode";
import { extension_name } from "../../constants";
import {
	applyReplacements,
	preprocessString,
	processCommandWithMap,
} from "../stringutils";
import { run_fmus_at_specific_dir } from "../fmus_ketik";
import { createNewTerminal } from "../terminal";
import { getBasename } from "../file_dir";

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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\bot_telegram.ts=BACA.md)
`;

export function register_dir_context_create_bot_telegram(
	context: vscode.ExtensionContext
) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_bot_telegram`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath);

			const result_map = await processCommandWithMap(command_v1);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(
					`Process was canceled. No command to execute.`
				);
			} else {
				console.log("Processed Result:", result_map.result);
				console.log("Map:", result_map.map);

				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(result_map.result);
				const fmus_command_replaced = applyReplacements(
					fmus_command,
					result_map.map
				);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath);
				terminal.sendText(
					applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map)
				);
			}
		}
	);
	context.subscriptions.push(disposable);
}

const information = `

Here’s a step-by-step guide for starting a Discord bot project in Python, from setting up your environment to running the bot, including both commands and development activities:

### 1. **Set Up Your Python Environment**
	 - Ensure Python 3.8 or higher is installed:
		 bash
		 python --version


	 - Create a project folder:
		 bash
		 mkdir discord-bot
		 cd discord-bot


	 - Set up a virtual environment:
		 bash
		 python -m venv venv


	 - Activate the virtual environment:
		 - **Windows:**
			 bash
			 venv\\Scripts\\activate

		 - **Mac/Linux:**
			 bash
			 source venv/bin/activate


### 2. **Install Required Packages**
	 - Install discord.py and python-dotenv (for environment variables):
		 bash
		 pip install discord.py python-dotenv


### 3. **Create the .env File for Token Storage**
	 - Create a .env file to securely store your bot token (replace your_bot_token with your actual bot token):

		 DISCORD_TOKEN=your_bot_token


### 4. **Editing the Main File**
	 - Create and edit your main bot file, e.g., bot.py:
		 bash
		 touch bot.py


	 - Edit bot.py with this basic bot code:

		 python
		 import os
		 import discord
		 from dotenv import load_dotenv

		 load_dotenv()
		 TOKEN = os.getenv('DISCORD_TOKEN')

		 intents = discord.Intents.default()
		 client = discord.Client(intents=intents)

		 @client.event
		 async def on_ready():
				 print(f'{client.user} has connected to Discord!')

		 client.run(TOKEN)


### 5. **Run Your Bot Locally**
	 - Run the bot to test it:
		 bash
		 python bot.py


### 6. **Add Event Handlers & Commands**
	 - Add more event handlers or commands. For example, adding a message handler in bot.py:

		 python
		 @client.event
		 async def on_message(message):
				 if message.author == client.user:
						 return

				 if message.content == '!hello':
						 await message.channel.send('Hello!')


### 7. **Test Your Bot Again**
	 - Run the bot again:
		 bash
		 python bot.py


### 8. **Error Handling & Logging (Optional)**
	 - Add error handling and logging (optional step for better debugging):

		 python
		 import logging
		 logging.basicConfig(level=logging.INFO)


### 9. **Finalizing & Deploying Your Bot**
	 - After development, you can choose to host the bot on a service like Heroku, AWS, or your own server.

	 - Install any additional packages or libraries needed for your deployment environment.

### 10. **Deactivate the Virtual Environment (Optional)**
	 - When you're done working:
		 bash
		 deactivate


By following this list of commands and activities, you should have a functioning Discord bot built with Python.
`;
