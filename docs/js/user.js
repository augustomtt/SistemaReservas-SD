

var btnConfirm = document.getElementById("btn-confirm")
var mapa = document.getElementById("map")
var sucursal = document.getElementById("sucursales")
var listaTurno = document.getElementById("lista_turnos")
var labelTurno = document.getElementById("label_turnos")
btnConfirm.addEventListener('click',function(e){
    e.preventDefault();
    alert("Turno Confirmado");


})
sucursal.addEventListener('change',function(e){
    e.preventDefault();
      //Prueba de mostrar el mapa de cartes.io
    const request = fetch('https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec?lat=-31.94411429512263&lng=-34.71679687500001&zoom=3',{
        method: "GET",
        headers: {'Accept': 'application/json'}
      }
    
    ).then(res =>{

      console.log(res)
    //mapa.append(res)
    });
   
    labelTurno.style.display = "inline-block"
    listaTurno.style.display = "inline-block"
   
});


