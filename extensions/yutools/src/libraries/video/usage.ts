import { LiveKitRoom, toggleAudio, toggleVideo, sendMessage, onMessageReceived, startScreenShare } from '.';

async function startMeeting() {
  const room = new LiveKitRoom('my-room', 'my-token');
  await room.connect('wss://your-livekit-server');

  // Toggle audio and video
  await toggleAudio(room.getRoomInstance());
  await toggleVideo(room.getRoomInstance());

  // Send and receive messages
  await sendMessage(room.getRoomInstance(), 'Hello, everyone!');
  onMessageReceived(room.getRoomInstance(), (message) => {
    console.log(`Received: ${message}`);
  });

  // Start screen sharing
  await startScreenShare(room.getRoomInstance());
}

startMeeting();