const express = require('express');
const app = express();
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const port = 8080
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'https://dev-pn7zgl7ckp8stzea.us.auth0.com/api/v2/',
  issuerBaseURL: `https://dev-pn7zgl7ckp8stzea.us.auth0.com`,
});
app.use(checkJwt) 

// This route needs authentication
/*app.get('/api/auth/private', checkJwt, function(req, res) {
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
});*/
app.get('/*', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.listen(port);
console.log("server listening on port " + port);