const http = require('http');
const fs = require('fs');
const path = require('url');
var reservas = require('./reservas.json');
var config = require('./config.json');

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

function getTurnos(res, queryParams) {
  let turnos = [];

  // Falta la parte de filtar por los query params
  reservas.forEach(r => {
    let userId = (queryParams.userId != undefined) ? queryParams.userId : r.userId;
    let branchId = (queryParams.branchId != undefined) ? queryParams.branchId : r.branchId;
    let fecha = r.datetime.split("T");
 
    let dateTime = (queryParams.dateTime != undefined) ? queryParams.dateTime: fecha[0];

    if (r.userId == userId && r.branchId == branchId && fecha[0] == dateTime)
      turnos.push(r);
  });

  if (turnos.length > 0) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(turnos));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    let respuesta = {
      msg: "No se encuentra ningun turno"
    }
    res.write(JSON.stringify(respuesta));
  }

  res.end()
}
function getReserva(res, idReserva) {

  let reserva = reservas.find(r => r.id == idReserva);
  let respuesta = {
    msg: ""
  }
  if (reserva != undefined) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(reserva));
  } else {
    //Devuelvo error
    res.writeHead(404, { 'Content-Type': 'application/json' });
    respuesta.msg = "No se encuentra ninguna reserva con ese id";
    res.write(JSON.stringify(respuesta));
  }
  res.end();
}

function bajaReserva(res, idReserva) { 

  let reserva = reservas.find(r => r.id == idReserva);
  let respuesta = {
    msg: ""
  }
  if (reserva != undefined){
    if(reserva.email!=null && reserva.userId!=-1 && reserva.status != 0){
      reserva.email = null;
      reserva.userId = -1;
      reserva.status = 0;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      respuesta.msg = "Turno eliminado correctamente";
      fs.writeFile('reservas.json', JSON.stringify(reservas), 'utf8', (err) => {
        if (err) throw err;
      });
    }
    else{
      res.writeHead(404, { 'Content-Type': 'application/json' });
      respuesta.msg = "La reserva no esta asociada a ningun usuario";
    }

   
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    respuesta.msg = "No se encuentra ninguna reserva con ese id";
  }
  res.write(JSON.stringify(respuesta));
  res.end()
}

function altaReserva(req, res, idReserva) { 
  let date="";
  let respuesta = {
    msg:""
  };
  let resultado = 0;
  bodyParser(req)
    .then(() => {

      reservas.forEach(element => {
        if (element.id == idReserva && element.userId==req.body.userId && element.status==1) {
          element.email = req.body.email;
          element.userId = req.body.userId;
          element.status = 2;
          date = element.datetime;
          resultado = 1;
        }
      });
      if (resultado) {

            res.writeHead(200, { 'Content-Type': 'application/json' });
            respuesta.msg = "Reserva confirmada correctamente";
            fs.writeFile('reservas.json', JSON.stringify(reservas), 'utf8', (err) => {
              if (err) throw err;
            });

            //comunicarse con notificacion.
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              } 
            }
            const request = http.request("http://localhost:"+ config.puertoNotificacion+"/api/notificacion",options,function(response){
              let body = ''

              response.on('data', (chunk) => {
                body += chunk;
              });

              response.on('end', () => {
                res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
              });

              response.on('close', () => {
                console.log('Connection closed with Notificacion');
              });
            });
            request.write(JSON.stringify({
              "destinatario": req.body.email,
              "asunto": "Notificacion Reserva",
              "cuerpo":  `Tu reserva del dia ${new Date(date).toISOString} fue confirmada con exito`
            }));
            request.end();
    
      }
      else{
        res.writeHead(404, { 'Content-Type': 'application/json' });
        respuesta.msg = "Confirmacion Incorrecta";
      }
        
      res.write(JSON.stringify(respuesta));
      res.end();
    })
    .catch(error => console.error(error));
}


function verificaTurno(req,res,idReserva) { // cambio status de 0 a 1, y pongo userId

    let respuesta = {
      msg:""
    };
    bodyParser(req)
    .then(()=>{
      let reserva = reservas.find(r => r.id == idReserva);
  
    if (reserva != undefined) {
      if (reserva.status == 0) {
        reserva.status = 1;
        reserva.userId = req.body.userId; 
        fs.writeFile('reservas.json', JSON.stringify(reservas), 'utf8', (err) => {
          if (err) throw err;
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        respuesta.msg = "Turno Verificado correctamente";
        res.write(JSON.stringify(respuesta));
      }
      else{
        res.writeHead(404, { 'Content-Type': 'application/json' });//verificar este caso, creo que no es asi
        respuesta.msg = "Error en verificacion, el turno esta reservado";
        res.write(JSON.stringify(respuesta));
      }
    } else {
      //Devuelvo error
      res.writeHead(404, { 'Content-Type': 'application/json' });
      respuesta.msg = "Error en verificacion, reserva incorrecta";
      res.write(JSON.stringify(respuesta));
    }
    res.end();
    })
    .catch(error => console.error(error));

}
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  const { url, method } = req;
  const queryParams = path.parse(req.url, true).query;
  console.log(`URL: ${url} - METHOD: ${method}`);


  if (url.startsWith("/api/reservas")){
    let parametros = url.split("/");
    parametros = parametros.filter(el => el != '')   //filtro los vacios
    //console.log(parametros);
    switch (method) {
      //&& parametros[1].includes("reservas?")
      case "GET":
        if((parametros.length ==2 && parametros[1] == "reservas") || ( parametros.length >= 2 &&  parametros[1].startsWith("reservas?"))) {

          getTurnos(res, queryParams)   // turnos (chequear query params para filtar)
        }
        if (parametros.length == 3 && !parametros[1].includes("reservas?")) { // reserva vinculada a ese idReserva

          getReserva(res, parametros[2])
        }
        break;
      case "POST":
        if(parametros[2] == "confirmar")
          altaReserva(req, res, parametros[3]);
        if(parametros[2] == "solicitar")
          verificaTurno(req,res,parametros[3]);
        break;
      case "DELETE":
        bajaReserva(res, parametros[2])
        break;
    }
  }
})

server.listen(config.puerto);
console.log('Gestion Reservas', config.puerto);

