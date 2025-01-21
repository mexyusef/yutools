import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const toggleVideoCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.toggleVideo', async () => {
  if (liveKitRoom) {
    await toggleVideo(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})