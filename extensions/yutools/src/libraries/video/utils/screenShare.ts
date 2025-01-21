import { Room } from 'livekit-client';

export async function startScreenShare(room: Room) {
  try {
    await room.localParticipant.setScreenShareEnabled(true);
    console.log('Screen sharing started');
  } catch (error) {
    console.error('Failed to start screen sharing:', error);
    throw error;
  }
}

export async function stopScreenShare(room: Room) {
  try {
    await room.localParticipant.setScreenShareEnabled(false);
    console.log('Screen sharing stopped');
  } catch (error) {
    console.error('Failed to stop screen sharing:', error);
    throw error;
  }
}