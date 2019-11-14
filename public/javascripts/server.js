const Video = Twilio.Video;
var urlParams = new URLSearchParams(window.location.search);
localTracks = [];
var clientToken;
var localVideoTracks;
var localDataTrack;

// This is an example of how to create a mediaStreamTracks array from all video sources
// This is an alternative to use getUserMedia() to generate a list of tracks
// (see examples in https://media.twiliocdn.com/sdk/js/video/releases/1.0.0/docs/global.html#connect)
// Using getUserMedia() infact just generate an audio track and the defaul video track
//
// async function getVideoDevicesMediaStreamTracks() {
//   // To make this code more readable, this is an async function
//   // In production promises can be used instead for wider compatibility
//   let mediaStreamTracks = [];
//   let deviceInfos = await navigator.mediaDevices.enumerateDevices();
//   let videoDeviceInfos = deviceInfos.filter(
//     deviceInfo => deviceInfo.kind === 'videoinput'
//   );

//   // To make this code more readable, we hardcode the two cameras
//   // Production code can use Promise.all() to create one single promise
//   let camera1 = await navigator.mediaDevices.getUserMedia({
//     video: { deviceId: videoDeviceInfos[0].deviceId },
//     audio: false
//   });
//   let camera2 = await navigator.mediaDevices.getUserMedia({
//     video: { deviceId: videoDeviceInfos[1].deviceId },
//     audio: false
//   });
//   mediaStreamTracks.push(camera1.getTracks()[0]);
//   mediaStreamTracks.push(camera2.getTracks()[0]);
//   return mediaStreamTracks;
// }

// This is an example of using the above function
// function connect() {
//   ...
//   getVideoDevicesMediaStreamTracks().then(videoDevicesMediaStreamTracks => {
//     // For demo pourpose, we don't use any audio (to avoid echo)
//     var connectOptions = {
//       name: urlParams.get('room'),
//       tracks: videoDevicesMediaStreamTracks
//     };
//     Video.connect(token.token, connectOptions).then(roomJoined, function(
//       error
//     ) {
//       log('Could not connect to Twilio: ' + error.message);
//     });
//   });
//   ...
// }

// This is a _simplified_ version of generating as many local video tracks
// as available devices. For a different approach to that see the gist above
// function getAvailableLocalVideoTracks() {
//   return navigator.mediaDevices.enumerateDevices().then(inputDeviceInfos => {
//     let promises = [];
//     inputDeviceInfos.forEach(inputDeviceInfo => {
//       if (inputDeviceInfo.kind == 'videoinput') {
//         promises.push(
//           Video.createLocalVideoTrack({ deviceId: inputDeviceInfo.deviceId })
//         );
//       }
//     });
//     return Promise.all(promises);
//   });
// }

function roomJoined(room) {
  console.log('Room joined');
  document.getElementById('share-screen').disabled = true;
  document.getElementById('stop-share-screen').disabled = false;
}

document.getElementById('share-screen').onclick = async function(event) {
  let token = await fetchToken();
  clientToken = token;
  await fetch('/create-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'screen-sharing', recording: false })
  });
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });
  connectOptions = {
    name: 'screen-sharing',
    tracks: stream.getTracks()
  };
  Video.connect(token.token, connectOptions).then(roomJoined, function(error) {
    log('Could not connect to Twilio: ' + error.message);
  });
};
