const { bodyParser } = require("./bodyParser");
const config = require('./config.json');
const { application } = require('express');
const express = require('express');
const app = express();
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const http = require('http')
const path = require('url');

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const port = config.puerto;
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'KMWqrOft0FpDJNmnzYriye6rOAQpXqQ9',
  issuerBaseURL: `https://dev-pn7zgl7ckp8stzea.us.auth0.com`,
});
app.use(checkJwt) 
/*
// This route needs authentication
app.get('/api/auth/private', checkJwt, function(req, res) {
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
});
app.get('/*', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});*/

app.post('/api/reservas/*', checkJwt, function (req, res) {
  const { url, method } = req;
  let parametros = url.split("/");
  bodyParser(req)
          .then(() => {

            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
            };
            const request = http.request("http://localhost:"+ config.puertoReservas + url, options, function (response) {
              let body = ''

              response.on('data', (chunk) => {
                body += chunk;
              });

              response.on('end', () => {
                res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                body = JSON.parse(body);
                res.write(JSON.stringify(body));
                res.end();
              });

              response.on('close', () => {
                console.log('Connection closed with Reservas');
              });
            });
            if(parametros[2] == "solicitar"){
              request.write(JSON.stringify({
                "userId": req.body.userId
              }));
            }
            if(parametros[2] == "confirmar"){
              request.write(JSON.stringify({
                "email": req.body.email,
                "userId": req.body.userId
              }));
            }
            
            request.end();
          })
          .catch(error => console.error(error));
});

app.listen(port);
console.log("server listening on port " + port);