function roomJoined() {

}

document.addEventListener("DOMContentLoaded", async function() {

    let token = await getToken(); 
    Video.connect(token.token, {video: false, audio: true}).then(roomJoined, function(error) {
        log('Could not connect to Twilio: ' + error.message);
      });

})