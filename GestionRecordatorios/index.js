const http = require('http');

function main () {
  http.get('http://localhost:8000/api/reservas/', (res) => {
    let body = '';
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', (d) => {
      body += d;
    });

    res.on('end', () => {
      const reservas = JSON.parse(body);
      reservas.forEach((reserva) => {
        const time = new Date(reserva.datetime);
        if (isSameDate(time)) {

          console.log('Enviando recordatorio', reserva);
          let postData = {
            "destinatario": reserva.email,
            "asunto": "Recordatorio de reserva desde api",
            "cuerpo": "Recordatorio de reserva para el día de hoy"
          }

          const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/notificacion',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }

          const req = http.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', (d) => {
              process.stdout.write(d)
            })
          })

          req.on('error', (error) => {
            console.error(error)
          })

          req.write(JSON.stringify(postData))
          req.end()

        } else {
          console.log('No se envia recordatorio');
        }
      });
    });
  })
}

const isSameDate = (date1, date2 = new Date()) => {
  console.log(date2);
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

setInterval(main, 60000);