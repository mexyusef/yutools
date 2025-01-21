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

export function register_dir_context_create_websocket_web(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_websocket_web`,
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


const PORT = process.env.PORT || 3000;

const information = `
To set up WebSocket communication between a web frontend and backend, you'll need to follow several steps. Below is a comprehensive list of commands and activities you'll typically perform, broken down into sections for both the frontend and backend. I'll assume you're using Node.js for the backend and a typical JavaScript frontend, but the commands can be adapted based on your specific technology stack.

### Backend Setup

1. **Initialize the Backend Project:**
   bash
   mkdir websocket-backend
   cd websocket-backend
   npm init -y


2. **Install Required Packages:**
   bash
   npm install express ws


3. **Create the Main Server File:**
   bash
   touch index.js


4. **Edit Main File to Set Up WebSocket Server:**
   Open index.js in your code editor and add the following code:
   javascript
   const express = require('express');
   const WebSocket = require('ws');

   const app = express();
   const server = require('http').createServer(app);
   const wss = new WebSocket.Server({ server });

   wss.on('connection', (ws) => {
	   console.log('Client connected');

	   ws.on('message', (message) => {
		   console.log(Received message: message);
		   // Echo the message back
		   ws.send(You sent: message);
	   });

	   ws.on('close', () => {
		   console.log('Client disconnected');
	   });
   });

   const PORT = process.env.PORT || 3000;
   server.listen(PORT, () => {
	   console.log(Server is listening on port ${PORT});
   });


5. **Run the Backend Server:**
   bash
   node index.js


### Frontend Setup

1. **Initialize the Frontend Project:**
   bash
   mkdir websocket-frontend
   cd websocket-frontend
   npm init -y


2. **Install Required Packages (if using a framework like React, Vue, etc.):**
   For plain HTML/JS, you may not need additional packages. If using a framework, install the necessary dependencies.
   bash
   # Example for React
   npx create-react-app my-app
   cd my-app


3. **Edit the Main Frontend File to Connect to WebSocket:**
   Open your main frontend file (e.g., src/App.js in React) and add the following code:
   javascript
   import React, { useEffect, useState } from 'react';

   function App() {
	   const [messages, setMessages] = useState([]);
	   const [input, setInput] = useState('');
	   let socket;

	   useEffect(() => {
		   // Establish WebSocket connection
		   socket = new WebSocket('ws://localhost:3000');

		   socket.onopen = () => {
			   console.log('Connected to WebSocket server');
		   };

		   socket.onmessage = (event) => {
			   setMessages((prev) => [...prev, event.data]);
		   };

		   socket.onclose = () => {
			   console.log('Disconnected from WebSocket server');
		   };

		   return () => {
			   socket.close();
		   };
	   }, []);

	   const sendMessage = () => {
		   socket.send(input);
		   setInput('');
	   };

	   return (
		   <div>
			   <h1>WebSocket Chat</h1>
			   <div>
				   <input
					   value={input}
					   onChange={(e) => setInput(e.target.value)}
					   placeholder="Type a message..."
				   />
				   <button onClick={sendMessage}>Send</button>
			   </div>
			   <ul>
				   {messages.map((msg, index) => (
					   <li key={index}>{msg}</li>
				   ))}
			   </ul>
		   </div>
	   );
   }

   export default App;


4. **Run the Frontend Server:**
   bash
   npm start


### Testing the WebSocket Connection

1. **Open Multiple Browser Tabs:**
   Open your browser and navigate to http://localhost:3000 (or the appropriate URL for your frontend).

2. **Send Messages:**
   Use one tab to send messages and observe the messages appearing in other tabs.

### Summary of Activities

- **Editing Main Files:** This includes editing index.js for the backend and the main frontend file to establish the WebSocket connection and handle messaging.
- **Running the Servers:** Start the backend and frontend servers to allow for communication.
- **Testing the Communication:** Open multiple tabs to ensure the WebSocket connection is functional and messages can be sent and received.

This should give you a comprehensive overview of the steps needed to set up WebSocket communication between your frontend and backend!

`;
