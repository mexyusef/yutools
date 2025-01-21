import { Room } from 'livekit-client';

export async function toggleVideo(room: Room) {
  try {
    const isCameraEnabled = room.localParticipant.isCameraEnabled;
    await room.localParticipant.setCameraEnabled(!isCameraEnabled);

    if (isCameraEnabled) {
      console.log('Camera turned off');
    } else {
      console.log('Camera turned on');
    }
  } catch (error) {
    console.error('Failed to toggle camera:', error);
    throw error;
  }
}