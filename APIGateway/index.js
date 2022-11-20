const http = require('http')
const path = require('url');
const config = require('./config.json');
const { bodyParser } = require("./bodyParser");

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  const { url, method } = req;

  console.log(`URL: ${url} - METHOD: ${method}`);

  let parametros = url.split("/");
  parametros = parametros.filter(el => el != '')
  if (url.startsWith("/api/sucursales")) {
   

    http.get("http://localhost:"+config.puertoSucursales+url, respuesta => {//ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
      //posiblemente con req.connection.remoteAddress y port
      let data = '';
      respuesta.on('data', chunk => {
        data += chunk;
      });
      respuesta.on('end', () => {
        res.writeHead(respuesta.statusCode, { 'Content-Type': 'application/json' });
        data = JSON.parse(data);
        res.write(JSON.stringify(data))
        res.end();
      })
    }).on('error', err => {
      console.log(err.message);
    })

  }
  if (url.startsWith("/api/reservas")) {
   
    switch (method) {
        case "GET":
          http.get("http://localhost:" + config.puertoReservas + url, respuesta => {//ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
            //posiblemente con req.connection.remoteAddress y port
            let data = '';
            respuesta.on('data', chunk => {
              data += chunk;
            });
            respuesta.on('end', () => {
              res.writeHead(respuesta.statusCode, { 'Content-Type': 'application/json' });
              data = JSON.parse(data);
              res.write(JSON.stringify(data))
              res.end();
            })
          }).on('error', err => {
            console.log(err.message);
          })

        break;

        case "POST":
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

        break;

        case "DELETE": // baja de reserva
           
          const options = {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },

            };
          
          
           const request = http.request("http://localhost:"+ config.puertoReservas + url, options,function  (response){
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
                request.end();
      break;
    }
  }
})

server.listen(config.puerto);
console.log('API Gateway', config.puerto);