import { Room, RemoteParticipant, TrackPublication } from 'livekit-client';

/**
 * Invite a participant to the room.
 * @param room - The LiveKit room instance.
 * @param participantId - The ID of the participant to invite.
 */
export async function inviteParticipant(room: Room, participantId: string) {
  try {
    // Logic to invite a participant (e.g., via API or signaling)
    console.log(`Invited participant: ${participantId}`);
  } catch (error) {
    console.error('Failed to invite participant:', error);
    throw error;
  }
}

/**
 * Remove a participant from the room.
 * @param room - The LiveKit room instance.
 * @param participantId - The ID of the participant to remove.
 */
export async function removeParticipant(room: Room, participantId: string) {
  try {
    // Logic to remove a participant
    console.log(`Removed participant: ${participantId}`);
  } catch (error) {
    console.error('Failed to remove participant:', error);
    throw error;
  }
}

/**
 * List all participants in the room.
 * @param room - The LiveKit room instance.
 * @returns An array of participant identities.
 */
export function listParticipants(room: Room): string[] {
  return Array.from(room.remoteParticipants.values()).map(
    (participant: RemoteParticipant) => participant.identity
  );
}

/**
 * Mute all participants in the room.
 * @param room - The LiveKit room instance.
 */
export async function muteAllParticipants(room: Room) {
  try {
    room.remoteParticipants.forEach((participant: RemoteParticipant) => {
      // Mute the participant's audio tracks
      participant.audioTrackPublications.forEach((publication: TrackPublication) => {
        if (publication.track) {
          // Mute the track by disabling the underlying MediaStreamTrack
          publication.track.mediaStreamTrack.enabled = false;
        }
      });
    });
    console.log('All participants muted');
  } catch (error) {
    console.error('Failed to mute participants:', error);
    throw error;
  }
}

export async function unmuteAllParticipants(room: Room) {
  try {
    room.remoteParticipants.forEach((participant: RemoteParticipant) => {
      participant.audioTrackPublications.forEach((publication: TrackPublication) => {
        if (publication.track) {
          publication.track.mediaStreamTrack.enabled = true;
        }
      });
    });
    console.log('All participants unmuted');
  } catch (error) {
    console.error('Failed to unmute participants:', error);
    throw error;
  }
}