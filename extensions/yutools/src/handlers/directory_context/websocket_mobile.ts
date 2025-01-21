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

export function register_dir_context_create_websocket_mobile(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_websocket_mobile`,
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
To start a WebSocket communication between a mobile app and a backend project, you can follow these steps. The commands and activities will depend on the specific technologies you’re using, but I’ll provide a general outline that can be adapted to various frameworks and platforms. Here’s a step-by-step list:

### Backend Setup

1. **Set Up Your Project**
   bash
   mkdir backend
   cd backend
   npm init -y  # or your preferred backend setup


2. **Install WebSocket Library**
   For example, using Node.js with ws:
   bash
   npm install ws


3. **Create WebSocket Server**
   - **Editing main file (e.g., server.js)**:
	 javascript
	 const WebSocket = require('ws');
	 const wss = new WebSocket.Server({ port: 8080 });

	 wss.on('connection', (ws) => {
		 console.log('Client connected');
		 ws.on('message', (message) => {
			 console.log('Received:', message);
			 // Echo the message back
			 ws.send(You said: message);
		 });
	 });

	 console.log('WebSocket server is running on ws://localhost:8080');


4. **Run the Backend Server**
   bash
   node server.js


### Mobile App Setup

1. **Set Up Your Mobile Project**
   For example, using React Native:
   bash
   npx react-native init MyApp
   cd MyApp


2. **Install WebSocket Library**
   For React Native, you might not need to install anything, as it comes with WebSocket support. But if you're using a different framework:
   bash
   npm install --save websocket  # or relevant package for your framework


3. **Create WebSocket Client**
   - **Editing main file (e.g., App.js)**:
	 javascript
	 import React, { useEffect } from 'react';
	 import { View, Text } from 'react-native';

	 const App = () => {
		 useEffect(() => {
			 const ws = new WebSocket('ws://localhost:8080');

			 ws.onopen = () => {
				 console.log('Connected to WebSocket server');
				 ws.send('Hello Server!');
			 };

			 ws.onmessage = (event) => {
				 console.log('Message from server:', event.data);
			 };

			 return () => {
				 ws.close();
			 };
		 }, []);

		 return (
			 <View>
				 <Text>WebSocket Client</Text>
			 </View>
		 );
	 };

	 export default App;


4. **Run the Mobile App**
   bash
   npx react-native run-android  # or run-ios


### Testing Communication

1. **Open Developer Console**
   - Check logs to see connection messages and data being sent/received.

2. **Simulate Interactions**
   - Send messages from the mobile app and observe responses in both the app and backend logs.

### Troubleshooting (if needed)

- **Check Network Settings**
  Ensure the mobile device/emulator is on the same network as your backend.

- **Inspect Errors**
  Use console logs and error handlers to debug any connection issues.

### Wrap Up

Once everything is running smoothly, you may want to:
- **Add Error Handling**
- **Implement Reconnection Logic**
- **Consider Security (SSL/TLS)**
- **Deploy Your Backend**

This workflow gives you a comprehensive approach to setting up WebSocket communication between a mobile application and a backend server. Adjust the commands and code snippets according to the specific technologies you are using.

`;
