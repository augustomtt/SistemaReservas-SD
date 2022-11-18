document.addEventListener('DOMContentLoaded',function(e){
    e.preventDefault();
var botonInvitado = document.getElementById('pagina-invitado');
var logeo  = document.getElementById('logeo');
var formulario = document.getElementById('main-form');

var navegacion = document.getElementById('navegacion');
var botonLogin = document.getElementById('login');
var botonLogout = document.getElementById('logout');
var misReservas = document.getElementById('mis-reservas');
var botonInicio = document.getElementById('boton-inicio');

botonInvitado.addEventListener('click',() =>{
    console.log(window.location.hash);
logeo.style.display = 'none';
navegacion.style.display = 'block';
formulario.style.display = 'block';
});

botonLogin.addEventListener('click',()=>{
    console.log(window.location.hash);
    logeo.style.display = 'none';
    navegacion.style.display = 'block'
    formulario.style.display = 'block'
    misReservas.style.display = 'block'
});

botonLogout.addEventListener('click',() =>{
    logeo.style.display = 'block';
    navegacion.style.display = 'none';
    formulario.style.display = 'none';
    misReservas.style.display = 'none'
});
});

// <script src="https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js"></script>
//script src="/js/login.js"></script>    
