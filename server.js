'use strict';

/**
 * Load Twilio configuration from .env config file
 */
require('dotenv').load();

const http = require('http');
const express = require('express');
const cors = require('cors');
const ngrok = require('ngrok');
const randomName = require('./randomname');

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_ACCOUNT_SECRET) {
  console.log(
    'Twilio credentials missing. Create a file named .env based on .env.template and add your Twilio Project credentials'
  );
  return;
}
// Twilio initialization
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_SECRET
);

// Create Express webapp.
var app = express();

// Static pages goes in ./public folder
app.use(express.static('public'));

// Enable CORS (especially useful if you have to publish REST APIs)
app.use(cors());

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post('/create-room', async function(request, response) {
  let existingRooms = await client.video.rooms.list({uniqueName: request.body.name})
  if (existingRooms.length > 0) {
    // Let's update the room status to complete
    console.log('Room existing. Set to complete')
    await client.video.rooms(existingRooms[0].sid).update({status: 'completed'})
  }
  let newRoom = await client.video.rooms.create({
    recordParticipantsOnConnect: request.body.recording === 'true',
    type: 'group',
    uniqueName: request.body.name
  })
  response.send(newRoom.uniqueName)
});

/**
 * Uncomment below to enable token generation route ('/token'). You need to fill in
 * TWILIO_TOKEN_API_KEY and TWILIO_TOKEN_API_SECRET in .env file.
 */
const getToken = require('./twilio-jwt');
app.get('/token', function(request, response) {
  response.send(getToken(randomName()));
});

// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
  // Enable ngrok
  ngrok
  .connect({
    addr: port,
      subdomain: process.env.NGROK_SUBDOMAIN
  })
  .then(url => {
    console.log(`ngrok forwarding: ${url} -> http://localhost:${port}`);
  })
  .catch(e => {
    console.log('ngrok error: ', e);
  });
});

