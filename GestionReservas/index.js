const http = require('http');
const fs = require('fs');
const path = require('url');
var reservas = require('./reservas.json');

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
    let dateTime = (queryParams.datetime != undefined) ? queryParams.datetime: fecha[0];
    
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

function bajaReserva(res, idReserva) { // status 0 tambn

  let reserva = reservas.find(r => r.id == idReserva);
  let respuesta = {
    msg: ""
  }
  if (reserva != undefined) {
    reserva.email = null;
    reserva.userId = -1;
    reserva.status = 0;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    respuesta.msg = "Turno eliminado correctamente"
    fs.writeFile('reservas.json', JSON.stringify(reservas), 'utf8', (err) => {
      if (err) throw err;
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    respuesta.msg = "No se encuentra ninguna reserva con ese id"
  }
  res.write(JSON.stringify(respuesta));
  res.end()
}

function altaReserva(req, res, idReserva) { // status a 2, verifico que status sea 1 y user Id

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
          resultado = 1;
        }
      });
      if (resultado) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        //Guardo el archivo nuevamente
        respuesta.msg = "Reserva confirmada correctamente";
        fs.writeFile('reservas.json', JSON.stringify(reservas), 'utf8', (err) => {
          if (err) throw err;
        });
        //comunicarse con notificacion.
      }

      else{
        res.writeHead(404, { 'Content-Type': 'application/json' });
        respuesta.msg = "Confirmacion Incorrecta";
      }
        
      res.write(JSON.stringify(respuesta));
      res.end()
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
    console.log(parametros);
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
          verificaTurno();
        break;
      case "DELETE":
        bajaReserva(res, parametros[2])
        break;
    }
  }
})
puerto = 8000;
server.listen(puerto);
console.log('Gestion Reservas', puerto);

