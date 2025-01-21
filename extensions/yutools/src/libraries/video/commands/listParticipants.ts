import * as vscode from 'vscode';
import { listParticipants, LiveKitRoom, muteAllParticipants, onMessageReceived, sendMessage, startScreenShare, stopScreenShare, toggleAudio, toggleVideo, unmuteAllParticipants } from '..';

export const listParticipantsCommand = (liveKitRoom: LiveKitRoom) => vscode.commands.registerCommand('livekit.listParticipants', async () => {
  if (liveKitRoom) {
    const participants = listParticipants(liveKitRoom.getRoomInstance());
    vscode.window.showInformationMessage(`Participants: ${participants.join(', ')}`);
  } else {
    vscode.window.showErrorMessage('You must join a room first.');
  }
})