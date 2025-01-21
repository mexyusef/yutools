import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const toggleAudioCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.toggleAudio', async () => {
  if (liveKitRoom) {
    await toggleAudio(liveKitRoom.getRoomInstance());
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})