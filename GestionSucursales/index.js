const http = require('http');
var sucursales =  require('./sucursales.json');

function getSucursales(res){
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(sucursales)); // envio las sucursales
    res.end()
}

function getSucursal(res,idSucursal){
    let sucursal = {}
    sucursales.forEach(s => {
        if(s.id == idSucursal){
            sucursal = {
                
                    "id": s.id, 
                    "lat": s.lat,
                    "lng": s.lng,
                     "name": s.name
                    }
                 
            }
        
    });

    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
                    res.write(JSON.stringify(sucursal)); // envio las sucursales
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
    let  parametros = url.split(":")
    switch(method){
        
        case "GET":
            console.log(parametros)
            if(parametros.length == 1){ // todas las sucursales
                getSucursales(res)
            }
            if(parametros.length == 2){ // una unica suscursal
               
             let idSucursal = parametros[1];
             getSucursal(res,idSucursal)

             }
            break;    
    }
    })
    
    
    server.listen(8080);
    console.log('Gestion Sucursales',8080);