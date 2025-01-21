import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const stopScreenShareCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.stopScreenShare', async () => {
  if (liveKitRoom) {
    await stopScreenShare(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})