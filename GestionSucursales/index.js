const http = require('http');
var sucursales =  require('./sucursales.json');

function getSucursales(res){
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(sucursales)); // envio las sucursales
    res.end()
}
const server = http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    const{ url,method} = req;
    
    //Logger
    console.log(`URL: ${url} - METHOD: ${method}`);
    
    switch(method){
        case "GET":
           
            if(url == "/"){
                getSucursales(res)
            }
            break;    
    }
    })
    
    
    server.listen(8080);
    console.log('Gestion Sucursales',8080);