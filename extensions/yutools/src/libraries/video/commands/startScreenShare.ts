import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const startScreenShareCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.startScreenShare', async () => {
  if (liveKitRoom) {
    await startScreenShare(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})