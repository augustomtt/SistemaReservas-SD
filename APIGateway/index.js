const http  = require('http')

//Creo servidor
const server = http.createServer((req,res)=>{

const{ url,method} = req;

//Logger
console.log(`URL: ${url} - METHOD: ${method}`);

res.writeHead(200,{'Content-Type': 'text/plain'});
res.write('Received');
res.end();


switch(method){
    case "GET":
        if(url == "/sucursales"){
            res.writeHead(200,{'Content/Type':'application/json'});
            
        }
        if(url == "/reservas")
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