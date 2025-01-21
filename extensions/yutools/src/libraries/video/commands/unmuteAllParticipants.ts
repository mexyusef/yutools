import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const unmuteAllParticipantsCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.unmuteAllParticipants', async () => {
  if (liveKitRoom) {
    await unmuteAllParticipants(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})