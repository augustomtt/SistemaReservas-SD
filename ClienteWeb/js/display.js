
var botonInvitado = document.getElementById('pagina-invitado');
var logeo  = document.getElementById('logeo');
var formulario = document.getElementById('main-form');

var navegacion = document.getElementById('navegacion');
var botonLogin = document.getElementById('login');
var botonLogout = document.getElementById('logout');
var misReservas = document.getElementById('mis-reservas');
var botonInicio = document.getElementById('boton-inicio');

function invitado(){
    logeo.style.display = 'none';
navegacion.style.display = 'block';
formulario.style.display = 'block';
}

function logeado(){
    logeo.style.display = 'none';
    navegacion.style.display = 'block';
    formulario.style.display = 'block';
    misReservas.style.display = 'block';
}
if(window.location.hash == "#/invitado"){
        invitado();
}
if(window.location.hash == "#/logeado"){
        logeado();
}
botonInvitado.addEventListener('click',() =>{
    invitado();
});

botonLogout.addEventListener('click',() =>{
    logeo.style.display = 'block';
    navegacion.style.display = 'none';
    formulario.style.display = 'none';
    misReservas.style.display = 'none'
});

misReservas.addEventListener('click',()=>{
    
});

botonInicio.addEventListener('click',()=>{

    botonInicio.href = window.location.hash;
    
});





  
