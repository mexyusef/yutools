import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

let liveKitRoom: LiveKitRoom | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Command: Join LiveKit Room
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.joinRoom', async () => {
      const roomName = await vscode.window.showInputBox({ prompt: 'Enter room name' });
      const token = await vscode.window.showInputBox({ prompt: 'Enter token' });
      const url = await vscode.window.showInputBox({ prompt: 'Enter LiveKit server URL' });

      if (roomName && token && url) {
        liveKitRoom = new LiveKitRoom(roomName, token);
        await liveKitRoom.connect(url);
        vscode.window.showInformationMessage(`Connected to room: ${roomName}`);

        // Listen for chat messages
        onMessageReceived(liveKitRoom.getRoomInstance(), (message) => {
          vscode.window.showInformationMessage(`New message: ${message}`);
        });
      } else {
        vscode.window.showErrorMessage('Room name, token, and URL are required.');
      }
    })
  );

  // Command: Toggle Audio
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.toggleAudio', async () => {
      if (liveKitRoom) {
        await toggleAudio(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Toggle Video
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.toggleVideo', async () => {
      if (liveKitRoom) {
        await toggleVideo(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Start Screen Share
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.startScreenShare', async () => {
      if (liveKitRoom) {
        await startScreenShare(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Stop Screen Share
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.stopScreenShare', async () => {
      if (liveKitRoom) {
        await stopScreenShare(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Send Chat Message
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.sendMessage', async () => {
      if (liveKitRoom) {
        const message = await vscode.window.showInputBox({ prompt: 'Enter your message' });
        if (message) {
          await sendMessage(liveKitRoom.getRoomInstance(), message);
        }
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Mute All Participants
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.muteAllParticipants', async () => {
      if (liveKitRoom) {
        await muteAllParticipants(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: Unmute All Participants
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.unmuteAllParticipants', async () => {
      if (liveKitRoom) {
        await unmuteAllParticipants(liveKitRoom.getRoomInstance());
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );

  // Command: List Participants
  context.subscriptions.push(
    vscode.commands.registerCommand('livekit.listParticipants', async () => {
      if (liveKitRoom) {
        const participants = listParticipants(liveKitRoom.getRoomInstance());
        vscode.window.showInformationMessage(`Participants: ${participants.join(', ')}`);
      } else {
        vscode.window.showErrorMessage('You must join a room first.');
      }
    })
  );
}

export function deactivate() {
  if (liveKitRoom) {
    liveKitRoom.disconnect();
  }
}

// const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
// statusBarItem.text = '$(livekit) LiveKit';
// statusBarItem.command = 'livekit.joinRoom';
// statusBarItem.show();

// context.subscriptions.push(statusBarItem);