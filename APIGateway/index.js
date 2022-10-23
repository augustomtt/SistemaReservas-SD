const http  = require('http')

//Creo servidor
const server = http.createServer((req,res)=>{
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Request-Method', '*');
res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
res.setHeader('Access-Control-Allow-Headers', '*');

const{ url,method} = req;

console.log(`URL: ${url} - METHOD: ${method}`);

switch(method){
    case "GET":
        if(url == "/sucursales"){
            res.writeHead(200,{'Content-Type':'application/json'});
            
            http.get("http://localhost:8080", respuesta => {
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
        if(url == "/reserva"){
            res.writeHead(200,{'Content-Type': 'text/plain'});
            res.write('Reserva');
            res.end()

        }
        break;

    case "POST":
        break;
    case "PUT":
        break;
    case "DELETE":
        break;

    default:


}
})


server.listen(3000);
console.log('Server on port',3000);