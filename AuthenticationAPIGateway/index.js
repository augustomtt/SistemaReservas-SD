const { bodyParser } = require("./bodyParser");
const config = require("./config.json");
const { application } = require("express");
const express = require("express");
const app = express();
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");
const http = require("http");
const path = require("url");


const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const port = config.puerto;
const checkJwt = auth({
  audience: "KMWqrOft0FpDJNmnzYriye6rOAQpXqQ9",
  issuerBaseURL: `https://dev-pn7zgl7ckp8stzea.us.auth0.com`,
});
app.use(checkJwt);

app.post("/api/reservas/*", checkJwt, function (req, res) {
  let parametros = req.url.split("/");
  parametros = parametros.filter((el) => el != "");
  console.log(parametros);
  bodyParser(req)
    .then(() => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const request = http.request(
        "http://localhost:" + config.puertoReservas + req.url,
        options,
        function (response) {
          let body = "";

          response.on("data", (chunk) => {
            body += chunk;
          });

          response.on("end", () => {
            res.writeHead(response.statusCode, {
              "Content-Type": "application/json",
            });
            body = JSON.parse(body);
            res.write(JSON.stringify(body));
            res.end();
          });

          response.on("close", () => {
            console.log("Connection closed with Reservas");
          });
        }
      );
      if (parametros[2] == "solicitar") {
        request.write(
          JSON.stringify({
            userId: req.body.userId,
          })
        );
      }
      if (parametros[2] == "confirmar") {
        request.write(
          JSON.stringify({
            email: req.body.email,
            userId: req.body.userId,
          })
        );
      }

      request.end();
    })
    .catch((error) => console.error(error));
});

app.get("/api/sucursales/", function (req, res) {
  console.log("Recibido el GET de sucursales, se lo paso a ComponenteGestionSucursales");
  http.get("http://localhost:" + config.puertoSucursales + req.url, (respuesta) => {
      //ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
      //posiblemente con req.connection.remoteAddress y port
      let data = "";
      respuesta.on("data", (chunk) => {
        data += chunk;
      });
      respuesta.on("end", () => {
        res.writeHead(respuesta.statusCode, {
          "Content-Type": "application/json",
        });
        data = JSON.parse(data);
        res.write(JSON.stringify(data));
        res.end();
      });
    })
    .on("error", (err) => {
      console.log(err.message);
    });
});

app.get("/api/reservas/*", function (req, res) {
  http
    .get("http://localhost:" + config.puertoReservas + req.url, (respuesta) => {
      //ver si se puede usar URL sin hardcodearla? tal vez extraer la URL de la request
      //posiblemente con req.connection.remoteAddress y port
      let data = "";
      respuesta.on("data", (chunk) => {
        data += chunk;
      });
      respuesta.on("end", () => {
        res.writeHead(respuesta.statusCode, {
          "Content-Type": "application/json",
        });
        data = JSON.parse(data);
        res.write(JSON.stringify(data));
        res.end();
      });
    })
    .on("error", (err) => {
      console.log(err.message);
    });
});

app.delete("/api/reservas/*", checkJwt, function (req, res) { //se podrian extraer query params con express
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const request = http.request(
    "http://localhost:" + config.puertoReservas + req.url,
    options,
    function (response) {
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        res.writeHead(response.statusCode, {
          "Content-Type": "application/json",
        });
        body = JSON.parse(body);
        res.write(JSON.stringify(body));
        res.end();
      });

      response.on("close", () => {
        console.log("Connection closed with Reservas");
      });
    }
  );
  request.end();
});

app.listen(port);
console.log("server listening on port " + port);
