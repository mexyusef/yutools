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

export function register_dir_context_create_webrtc(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_webrtc`,
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
Starting a video communication project using WebRTC involves several steps, including setting up a signaling server, editing source files, and running commands to initiate the application. Below is a comprehensive list of commands and activities to help you through the process:

### Prerequisites
1. **Install Node.js and npm** (if not already installed):
   bash
   # Check if Node.js is installed
   node -v
   npm -v

   # If not, install Node.js (instructions vary by OS)


### Step 1: Set Up Project Directory
2. **Create a new project directory**:
   bash
   mkdir webrtc-video-communication
   cd webrtc-video-communication


3. **Initialize a new Node.js project**:
   bash
   npm init -y


### Step 2: Install Required Packages
4. **Install Express and Socket.IO**:
   bash
   npm install express socket.io


### Step 3: Create Server File
5. **Create a main server file (e.g., server.js)**:
   bash
   touch server.js


6. **Edit server.js**:
   javascript
   // <editing server.js>
   const express = require('express');
   const http = require('http');
   const socketIo = require('socket.io');

   const app = express();
   const server = http.createServer(app);
   const io = socketIo(server);

   // Serve static files
   app.use(express.static('public'));

   io.on('connection', (socket) => {
	   console.log('A user connected');

	   socket.on('offer', (offer) => {
		   socket.broadcast.emit('offer', offer);
	   });

	   socket.on('answer', (answer) => {
		   socket.broadcast.emit('answer', answer);
	   });

	   socket.on('candidate', (candidate) => {
		   socket.broadcast.emit('candidate', candidate);
	   });

	   socket.on('disconnect', () => {
		   console.log('User disconnected');
	   });
   });

   const PORT = process.env.PORT || 3000;
   server.listen(PORT, () => {
	   console.log(Server is running on http://localhost:${PORT});
   });


### Step 4: Create Client-side Files
7. **Create a directory for client-side files**:
   bash
   mkdir public


8. **Create HTML file (e.g., index.html)**:
   bash
   touch public/index.html


9. **Edit index.html**:
   html
   <!-- <editing public/index.html> -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
	   <meta charset="UTF-8">
	   <meta name="viewport" content="width=device-width, initial-scale=1.0">
	   <title>WebRTC Video Communication</title>
   </head>
   <body>
	   <h1>WebRTC Video Communication</h1>
	   <video id="localVideo" autoplay muted></video>
	   <video id="remoteVideo" autoplay></video>
	   <button id="startCall">Start Call</button>
	   <script src="/socket.io/socket.io.js"></script>
	   <script src="script.js"></script>
   </body>
   </html>


10. **Create JavaScript file (e.g., script.js)**:
	bash
	touch public/script.js


11. **Edit script.js**:
	javascript
	// <editing public/script.js>
	const socket = io();

	let localStream;
	let peerConnection;
	const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

	document.getElementById('startCall').onclick = async () => {
		localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		document.getElementById('localVideo').srcObject = localStream;

		peerConnection = new RTCPeerConnection(config);
		localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				socket.emit('candidate', event.candidate);
			}
		};

		peerConnection.ontrack = (event) => {
			document.getElementById('remoteVideo').srcObject = event.streams[0];
		};

		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);
		socket.emit('offer', offer);
	};

	socket.on('offer', async (offer) => {
		if (!peerConnection) {
			peerConnection = new RTCPeerConnection(config);
			localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

			peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					socket.emit('candidate', event.candidate);
				}
			};

			peerConnection.ontrack = (event) => {
				document.getElementById('remoteVideo').srcObject = event.streams[0];
			};
		}

		await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);
		socket.emit('answer', answer);
	});

	socket.on('answer', (answer) => {
		peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	});

	socket.on('candidate', (candidate) => {
		peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	});


### Step 5: Run the Server
12. **Start the server**:
	bash
	node server.js


### Step 6: Access the Application
13. **Open a web browser and navigate to**:

	http://localhost:3000


### Step 7: Test the Application
14. **Open the same URL in another browser tab or window** to simulate a second user and test the video communication.

### Optional Steps
15. **Deploy the application** (if desired):
	- Choose a cloud platform (like Heroku, AWS, etc.) and follow their specific deployment instructions.

This should give you a clear pathway from setting up your project to testing a WebRTC video communication application!

`;
