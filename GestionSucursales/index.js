const http = require('http');
var sucursales =  require('./sucursales.json');

function getSucursales(res){
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(sucursales)); // envio las sucursales
    res.end()
}

function getSucursal(res,idSucursal){
    let sucursal = sucursales.find(s=> s.id == idSucursal);
    
    
     if(sucursal!=undefined){
        res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
       res.write(JSON.stringify(sucursal)); // envio la sucursal  
     }
     else{
        res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
        res.write("Error, no se encuentra esa sucursal"); // envio la sucursal  
     }
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
    if(url.startsWith("/api/sucursales")){
        let parametros = url.split("/");
        parametros = parametros.filter(el => el != '')   //filtro los vacios
        console.log(parametros)
            if(parametros.length == 2){ // todas las sucursales
                getSucursales(res)
            }
            if(parametros.length == 3){ // una unica suscursal
                let idSucursal = parametros[2];
                getSucursal(res,idSucursal)
    
            }    
    }
    })
    server.listen(8080);
    console.log('Gestion Sucursales',8080);