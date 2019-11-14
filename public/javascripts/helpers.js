function log(message) {
    console.log(message)
}

function fetchToken() {
  return fetch('/token').then(response => response.json());
}

// Attach the Tracks to the DOM.
function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    container.appendChild(track.attach());
  });
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
  var tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
function detachTracks(tracks) {
  tracks.forEach(function(track) {
    if (track.detach) {
      track.detach().forEach(function(detachedElement) {
        detachedElement.remove();
      });
    }
  });
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

function initRoomEvents(room) {
  // When a Participant joins the Room, log the event.
  room.on('participantConnected', function(participant) {
    log("Joining: '" + participant.identity + "'");
  });

  // When a Participant removes a Track, detach it from the DOM.
  room.on('trackRemoved', function(track, participant) {
    log(participant.identity + ' removed track: ' + track.kind);
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on('participantDisconnected', function(participant) {
    log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  room.on('disconnected', function(room, error) {
    if (error) {
      console.log('Unexpectedly disconnected:', error);
    }
    room.localParticipant.tracks.forEach(function(track) {
      if (track.stop) {
        track.stop();
      }
      if (track.detach) {
        track.detach().forEach(detachedElement => {
          if (detachedElement) {
            detachedElement.remove();
          }
        });
      }
    });
  });
}


