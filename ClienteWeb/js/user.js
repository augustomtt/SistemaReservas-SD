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
    //Elimino los turnos
    //let options = listaTurno.querySelectorAll('option')
    //options.forEach(o => o.remove());
    //Cargar turnos de suscursal (comunicarse con api gateway)
    //cargarTurnos(sucursal.value);
    
    labelTurno.style.display = "inline-block"
    listaTurno.style.display = "inline-block"
   
});
function cargarTurnos(idSucursal){
}
(function cargarSucursales(){
  
  const request = fetch("http://localhost:3000/sucursales",{
    method: "GET",
    headers: {'Accept': 'application/json',
   // 'Access-Control-Allow-Origin': '*'    	
  }
  }
  ).then(res =>res.json())
  .then(data => {
  data.forEach(element => {
    let option  = document.createElement('option')
    option.value = element.id;
    option.text = element.name;
  sucursal.appendChild(option)
    });
  }
  )
.catch(error => console.error(error));

})();


 //Prueba de mostrar el mapa de cartes.io
      
      var url = 'https://cartes.io/api/maps'
    const request = fetch(url,{
        method: "GET",
        headers: {'Accept': 'application/json',
        'Content-type': 'text/html'
      }
      }
    
    ).then(res =>res.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));   