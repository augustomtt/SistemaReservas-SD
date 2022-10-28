const http = require('http');
const fs = require('fs');
const path = require('url'); 
var reservas =  require('./reservas.json');

function bodyParser(request) {
    return new Promise((resolve, reject) => {
      let body = "";
      request
        .on("error", err => {
          console.error(err);
          reject();
        })
        .on("data", chunk => {
          body += chunk;
        })
        .on('end', () => {
          request.body = JSON.parse(body);
          resolve();
        })
    });
}
  
function getTurnos(res,queryParams){
    res.writeHead(200,{'Content-Type':'application/json'}); 
    res.write(JSON.stringify(reservas)); 
    res.end()
}
function getReserva(res,idReserva){
    
  let reserva = reservas.find(r => r.id == idReserva);
  if(reserva!=undefined){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(JSON.stringify(reserva)); 
  }else{
    //Devuelvo error
    res.writeHead(404,{'Content-Type':'application/json'});
    respuesta = {

    }
    res.write(JSON.stringify(respuesta)); 
  }
  res.end();   
}
/*
function getReservasUsuarioSucursal(res,idUsuario,idSucursal){
    reservasUsuarioSucursal = []
    reservas.forEach(element => {
        if(element.userId == idUsuario && element.branchId==idSucursal){
           reservasUsuarioSucursal.push(element);
        }        
    });
    
    
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(reservasUsuarioSucursal)); // envio las reservas
    res.end()
}*/


function bajaReserva(idReserva){
    //eliminar reserva del JSON
    resultado = 1;//o 0
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(resultado);
    res.end()
}

function altaReserva(req,res,idReserva){

    let resultado = 0;
    bodyParser(req)
            .then(()=>{
               
                reservas.forEach(element => {
                    if(element.id == idReserva){
                        element.email = req.body.email;
                        element.userId = req.body.userId; 
                        resultado = 1;
                    }   
                });
                
                if(resultado){
                    res.writeHead(200,{'Content-Type':'application/json'});
                    //Guardo el archivo nuevamente
                    fs.writeFile('reservas.json', JSON.stringify(reservas),'utf8', (err) => { 
                        if (err) throw err; 
                        
                    }); 
                }
                   
                else
                    res.writeHead(400,{'Content-Type':'application/json'});
                res.write(JSON.stringify(resultado)); 
                res.end()
            
            
            })
            .catch(error => console.error(error));   
   
}


function verificaTurno(){

}


const server = http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,PUT,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', '*');
  
    const{url,method} = req;
    const queryParams = path.parse(req.url, true).query;

    console.log(`URL: ${url} - METHOD: ${method}`);
    console.log(queryParams);
 
    if(url.startsWith("/api/reserva")){
        let parametros = url.split("/");
        parametros = parametros.filter(el => el != '')   //filtro los vacios
        console.log(parametros)
        switch(method){
            case "GET":
                if(parametros.length == 2 || (parametros.length>2 && parametros[2].startsWith("?"))){ 
                    
                    getTurnos(res,queryParams)   // turnos (chequear query params para filtar)
                }
                if(parametros.length == 3 && !parametros[2].startsWith("?")){ // reserva vinculada a ese idReserva
                    
                    getReserva(res,parametros[2])
                }
                break;
            case "POST": 
                altaReserva(req,res,parametros[2]);
                break;
            case "DELETE":
                //bajaReserva(req,res,parametros[2])
                break;    
        }
    }
    })
    
puerto = 8000;
server.listen(puerto);
console.log('Gestion Reservas',puerto);

   