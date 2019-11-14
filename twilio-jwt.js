var AccessToken = require('twilio').jwt.AccessToken;

/**
 * Generate an Access Token for a video application - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
function getToken(identity) {
  var VideoGrant = AccessToken.VideoGrant;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_TOKEN_API_KEY,
    process.env.TWILIO_TOKEN_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  // Other grant can be found here https://www.twilio.com/docs/libraries/reference/twilio-node/3.36.0/jwt_AccessToken.js.html#line226
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  return {
    identity: identity,
    token: token.toJwt()
  };
}

module.exports = getToken