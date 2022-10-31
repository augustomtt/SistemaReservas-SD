const http  = require('http')
const path = require('url'); 

//Creo servidor
const server = http.createServer((req,res)=>{
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Request-Method', '*');
res.setHeader('Access-Control-Allow-Methods', '*');
res.setHeader('Access-Control-Allow-Headers', '*');

const{url,method} = req;
const queryParams = path.parse(req.url, true).query;
console.log(`URL: ${url} - METHOD: ${method}`);
//console.log(`${req.connection.remoteAddress},${req.connection.remotePort}`) 
let parametros = url.split("/");
parametros = parametros.filter(el => el != '')
if(url.startsWith("/api/sucursales")){      
            res.writeHead(200,{'Content-Type':'application/json'});
            
            http.get("http://localhost:8080/api/sucursales", respuesta => {//ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
                //posiblemente con req.connection.remoteAddress y port
            let data = '';
                respuesta.on('data', chunk => {
                  data += chunk;
                });
                respuesta.on('end', () => {
                  data = JSON.parse(data);
                 res.write(JSON.stringify(data))
                 res.end();
                })
              }).on('error', err => {
                console.log(err.message);
              })
       
      }
      if(url.startsWith("/api/reserva")){ 
        switch(method){
          case "GET":
            
              http.get("http://localhost:8000/api/reserva/"+parametros[2], respuesta => {//ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
              //posiblemente con req.connection.remoteAddress y port
              let data = '';
              respuesta.on('data', chunk => {
                data += chunk;
              });
              respuesta.on('end', () => {
               data = JSON.parse(data);
               res.write(JSON.stringify(data))
               res.end();
              })
            }).on('error', err => {
              console.log(err.message);
            })
            
            break;

          case "POST":

            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
             
            };
            
            const request = http.request("http://localhost:8000/api/reserva/1",options, function (response) {
              let body = ''
  
              response.on('data', (chunk) => {
                body += chunk;
              });
            
              response.on('end', () => {
                  res.writeHead(200,{'Content-Type': 'application/json'});
                  res.write(JSON.stringify(body));
                  res.end();
              });
            
              response.on('close', () => {
                  console.log('Connection closed with Reservas');
              });
            });
  
            request.write(JSON.stringify( {
              "email":"email@gmail.com",
              "userId":23
            })) 
            request.end();
            break;

            default:;
        }
            
        }
  

})

server.listen(3000);
console.log('API Gateway',3000);