const http = require('http');
var reservas =  require('./reservas.json');

function getReservas(res){
    res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify(reservas)); // envio las reservas
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
    
    switch(method){
        case "GET"://turnos sucursal y turnos usuario
            if(url == "/"){
                getReservas(res)
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
    
    //puerto = ;
    //server.listen(puerto);
    //console.log('Gestion Reservas',puerto);