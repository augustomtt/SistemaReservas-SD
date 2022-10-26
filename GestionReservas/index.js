const http = require('http');
var reservas =  require('./reservas.json');

function getReservas(res){
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(reservas)); // envio las reservas
    res.end()
}
function getReservasUsuario(res,idUsuario){
    
    reservasUsuario = []
    reservas.forEach(element => {
        if(element.userId == idUsuario){
           reservasUsuario.push(element);
        }        
    });
    
    
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(reservasUsuario)); // envio las reservas
    res.end()
}
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
}
function altaReserva(dateTime,email,branchid){
    //agrego reserva al JSON
    resultado = 1;//o 0
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(resultado);
    res.end()
}

function bajaReserva(idReserva){
    //eliminar reserva del JSON
    resultado = 1;//o 0
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(resultado);
    res.end()
}

function modificaReserva(idTurno,dateTime){
    //modificar reserva en el JSON
    resultado = 1;//o 0
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(resultado);
    res.end()
}

function getTurnosSucursal(){

}

function getTurnosUsuario(){

}

function verificaTurno(){

}


const server = http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    const{url,method} = req;
    
    //Logger
    console.log(`URL: ${url} - METHOD: ${method}`);
    let parametros = url.split(":");
    
    switch(method){
        case "GET":
            
            if(parametros.length == 1){ // todas las reservas
                getReservas(res)
            }
            if(parametros.length ==2 ){ // todas las reservas de un usuario
                getReservasUsuario(res,parametros[1])
            }
            if(parametros.length ==3){ // todas las reservas de un usuario de una sucursal
                getReservasUsuarioSucursal(res,parametros[1],parametros[2])
            }
            break;
        case "PUT": //alta y modificacion
            if (url == "/api/reserva/:idReserva"){

            }
            //else if (url == "/api/reserva/:idReserva")
            break;
        case "DELETE"://baja de reserva
            bajaReserva(res)
            break;    
    }
    })
    
    puerto = 8000;
    server.listen(puerto);
    console.log('Gestion Reservas',puerto);