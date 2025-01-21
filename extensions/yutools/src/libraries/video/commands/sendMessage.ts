import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const sendMessageCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.sendMessage', async () => {
  if (liveKitRoom) {
    const message = await vscode.window.showInputBox({ prompt: 'Enter your message' });
    if (message) {
      await sendMessage(liveKitRoom.getRoomInstance(), message);
    }
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})