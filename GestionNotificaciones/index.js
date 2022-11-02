//Este modulo se encarga de recibir un pedido de envio de email y lo ejecuta
const token = process.env.APIEMAIL;
const http = require('http');
const https = require('https'); //sendgrid encripta
const { bodyParser } = require("./bodyParser");

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const { url, method } = req;

    console.log(`URL: ${url} - METHOD: ${method}`);


    if (url.startsWith("/api/notificacion")) {//DEFINICION DE INTERFAZ PENDIENTE REVISAR DOC LUEGO (ya hice la sugerencia)
        if (method == "POST") {
            bodyParser(req)
                .then(() => {
                    const options = {
                        hostname: 'api.sendgrid.com',
                        path: '/v3/mail/send',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    };

                    var request = https.request(options, (response) => {
                        console.log('statusCode:', res.statusCode);
                        console.log('headers:', res.headers);

                        let bodyRespuesta = ''

                        response.on('data', (chunk) => {
                            bodyRespuesta += chunk; //SENDGRID NO ENVIA CUERPO DE RESPUESTA POR LO TANTO ESTÁ VACIO
                        });

                        response.on('end', () => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify(bodyRespuesta));
                            res.end();
                        });

                        response.on('close', () => {
                            console.log('Connection closed (Response sent!)');
                        });
                    });

                    req.on('error', (e) => {
                        console.error(e);
                    });
                    console.log(req.body);
                    var postData = {
                        "personalizations": [
                            {
                                "to": [
                                    {
                                        "email": `${req.body.destinatario}`
                                    }
                                ],
                                "subject": `${req.body.asunto}`
                            }
                        ],
                        "from": {
                            "email": "reservasdistribuidos@gmail.com",
                            "name": "Sistema: D'Alu, Ercoli, Gutiérrez, Maletta"
                        },
                        "content": [
                            {
                                "type": "text/html",
                                "value": `<p>${req.body.cuerpo}</p>`
                            }
                        ]
                    };


                    postData = JSON.stringify(postData);
                    request.write(postData);
                    request.end();
                }).catch(error => console.error(error));
        }
    }
});


server.listen(8080);
console.log('Gestion notificaciones', 8080);