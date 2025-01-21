import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const joinRoom = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.joinRoom', async () => {
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