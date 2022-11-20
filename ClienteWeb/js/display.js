
var botonInvitado = document.getElementById('pagina-invitado');
var logeo  = document.getElementById('logeo');
var formulario = document.getElementById('main-form');

var navegacion = document.getElementById('navegacion');
var botonLogin = document.getElementById('login');
var botonLogout = document.getElementById('logout');
var misReservas = document.getElementById('mis-reservas');
var botonInicio = document.getElementById('boton-inicio');
var reservas = document.getElementById('reservas');

function invitado(){
    reservas.style.display = 'none';
    logeo.style.display = 'none';
navegacion.style.display = 'block';
formulario.style.display = 'block';

}

function logeado(){
    reservas.style.display = 'none';
    logeo.style.display = 'none';
    navegacion.style.display = 'block';
    formulario.style.display = 'block';
    misReservas.style.display = 'block';
  
}
function mostrarReservas(){
    logeo.style.display = 'none';
    navegacion.style.display = 'block';
    formulario.style.display = 'none';
    misReservas.style.display = 'block';
    reservas.style.display = 'block';
}

window.addEventListener('hashchange',()=>{
    if(window.location.hash == "#/invitado"){
        invitado();
    }
    if(window.location.hash == "#/logeado"){
        logeado();
    }
    if(window.location.hash == "#/reservas"){
    mostrarReservas();
    }
});

if(window.location.hash == "#/invitado"){
        invitado();
}
if(window.location.hash == "#/logeado"){
        logeado();
}
if(window.location.hash == "#/reservas"){
    mostrarReservas();
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
    mostrarReservas();
});

botonInicio.addEventListener('click',()=>{
    if(window.location.hash == "#/reservas"){
        botonInicio.href = "#/logeado";
    }
    else{
        botonInicio.href = window.location.hash;
    }
});





  
