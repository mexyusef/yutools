import { Room, DataPacket_Kind } from 'livekit-client';

export async function sendMessage(room: Room, message: string) {
  await room.localParticipant.publishData(
    new TextEncoder().encode(message),
    { reliable: true }
  );
  console.log(`Message sent: ${message}`);
}

export function onMessageReceived(room: Room, callback: (message: string) => void) {
  room.on('dataReceived', (payload, participant, kind) => {
    if (kind === DataPacket_Kind.RELIABLE) {
      const message = new TextDecoder().decode(payload);
      callback(message);
    }
  });
}