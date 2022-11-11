import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const params = new URLSearchParams();
params.append('grant_type', 'password');
params.append('username', 'nxpscrsznansfjxmzn@tmmcv.net');
params.append('password','Sistemas distribuidos22');
//params.append('scope', 'read:sample');
params.append('client_id', 'idK4ciseIiaaR0GCbBVVdxxNJCoib86M');
params.append('client_secret', 'Pu_WIiiGjPQB34Iw3jvpXvRsorgy9GSNQhL7uWZIu4J56B51jeRGw7UJy9Q1wCcn');
params.append('audience', 'https://dev-pn7zgl7ckp8stzea.us.auth0.com/api/v2/');

(async function main() {
  const response = await fetch('https://dev-pn7zgl7ckp8stzea.us.auth0.com/oauth/token', {
    method: 'POST',
    body: params,
  });
  const json = await response.json();
  console.log(json);
})();