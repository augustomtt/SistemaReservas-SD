document.addEventListener('DOMContentLoaded',function(e){
    e.preventDefault();
var botonInvitado = document.getElementById('pagina-invitado');
var logeo  = document.getElementById('logeo');
var formulario = document.getElementById('main-form');
var navegacionInvitado = document.getElementById('navegacion-invitado');
var navegacionLogeado = document.getElementById('navegacion-logeado');
var botonLogin = document.getElementById('login');
var botonLogout = document.getElementById('logout');

botonInvitado.addEventListener('click',() =>{
logeo.style.display = 'none';
navegacionInvitado.style.display = 'block';
formulario.style.display = 'block';
});

botonLogin.addEventListener('click',()=>{
    logeo.style.display = 'none';
    navegacionLogeado.style.display = 'block'
    formulario.style.display = 'block'
});

botonLogout.addEventListener('click',() =>{
    alert("Logout")
    logeo.style.display = 'block';
    navegacionInvitado.style.display = 'none';
    navegacionLogeado.style.display = 'none';
    formulario.style.display = 'none';
});

});