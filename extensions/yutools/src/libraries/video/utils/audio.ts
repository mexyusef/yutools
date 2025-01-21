import { Room } from 'livekit-client';

export async function toggleAudio(room: Room) {
  try {
    const isMicrophoneEnabled = room.localParticipant.isMicrophoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);

    if (isMicrophoneEnabled) {
      console.log('Microphone turned off');
    } else {
      console.log('Microphone turned on');
    }
  } catch (error) {
    console.error('Failed to toggle microphone:', error);
    throw error;
  }
}