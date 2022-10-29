const token = process.env.APIEMAIL;
console.log(token);
//prueba de que la api sea un variable de entorno

const https = require('https');

var postData = {
  "personalizations": [
    {
      "to": [
        {
          "email": "reservasdistribuidos@gmail.com"
        }
      ],
      "subject": "YOUR SUBJECT LINE GOES HERE"
    }
  ],
  "from": {
    "email": "reservasdistribuidos@gmail.com",
    "name": "Example Order Confirmation"
  },
  "content": [
    {
      "type": "text/html",
      "value": "<p>Hello from Twilio SendGrid!</p>"
    }
  ]
};


postData = JSON.stringify(postData);
console.log(postData);


var options = {
  hostname: 'api.sendgrid.com',
  path: '/v3/mail/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
};

var req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
