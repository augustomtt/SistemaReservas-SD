const http = require("http");
const config = require("./config.json");
const sentRecordatories = [];

function main() {
  http.get(
    "http://localhost:" + config.puertoReserva + "/api/reservas",
    (res) => {
      let body = "";
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        body += d;
      });

      res.on("end", () => {
        const reservas = JSON.parse(body);
        reservas.forEach((reserva) => {
          const time = new Date(reserva.dateTime);

          if (shouldSendRecordatory(time) && reserva.status == 2) {
            if (wasNotSent(reserva) || wasSentToAnotherAccount(reserva)) {
              console.log("Enviando recordatorio", reserva);

              sentRecordatories.push(reserva);

              let postData = {
                destinatario: reserva.email,
                asunto: "Recordatorio de su reserva",
                cuerpo:
                  "Le recordamos que usted tiene una reservación para el día de hoy",
              };

              const options = {
                hostname: "localhost",
                port: config.puertoNotificacion,
                path: "/api/notificacion",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              };

              const req = http.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on("data", (d) => {
                  process.stdout.write(d);
                });
              });

              req.on("error", (error) => {
                console.error(error);
              });

              req.write(JSON.stringify(postData));
              req.end();
            }
          }
        });
      });
    }
  );
}

const shouldSendRecordatory = (date1, date2 = new Date()) => {
  const dif = date1 - date2;
  const horas = Math.floor(dif / (1000 * 60 * 60));
  return horas < 24 && horas > 0;
};

const wasSentToAnotherAccount = (reserva) => {
  return sentRecordatories.some(
    (r) => r.idReserva === reserva.idReserva && r.email !== reserva.email
  );
};

const wasNotSent = (reserva) => {
  return !sentRecordatories.some((r) => r.idReserva === reserva.idReserva);
};
console.log("Recordatorios funcionando");
setInterval(main, 60 * 60000); //una hora
