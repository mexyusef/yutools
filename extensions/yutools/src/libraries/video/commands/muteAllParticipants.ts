import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const muteAllParticipantsCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.muteAllParticipants', async () => {
  if (liveKitRoom) {
    await muteAllParticipants(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})