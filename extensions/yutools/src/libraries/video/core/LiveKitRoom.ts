import { Participant, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track, VideoPresets } from 'livekit-client';

export class LiveKitRoom {
  private room: Room;

  constructor(private roomName: string, private token: string) {
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    });
  }

  async connect(url: string) {
    try {
      await this.room.connect(url, this.token);
      console.log(`Connected to room: ${this.roomName}`);
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  async disconnect() {
    this.room.disconnect();
    console.log(`Disconnected from room: ${this.roomName}`);
  }

  getRoomInstance(): Room {
    return this.room;
  }

  onParticipantConnected(callback: (participant: Participant) => void) {
    this.room.on(RoomEvent.ParticipantConnected, callback);
  }

  onTrackSubscribed(callback: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => void) {
    this.room.on(RoomEvent.TrackSubscribed, callback);
  }

  // Cleanup event listeners
  cleanup() {
    this.room.removeAllListeners();
  }
}