var btnConfirm = document.getElementById("btn-confirm")
var mapa = document.getElementById("map")
var sucursal = document.getElementById("sucursales")
var listaTurno = document.getElementById("lista_turnos")
var labelTurno = document.getElementById("label_turnos")


btnConfirm.addEventListener('click',function(e){
    e.preventDefault();
    alert("Turno Confirmado");


})
//'https://cartes.io/api/maps//f5c63822-a9f9-47cc-aeae-207c99a31a56
sucursal.addEventListener('change',function(e){
    e.preventDefault();
      //Prueba de mostrar el mapa de cartes.io
      var url = 'https://cartes.io/api/maps'
    const request = fetch(url,{
        method: "POST",
        headers: {'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      }
    
    ).then(res =>res.json())
    .then(data => {
      console.log(data)
    }
      
    )
    .catch(error => console.error(error));   
  
    //Cargar turnos de suscursal (comunicarse con api gateway)
    console.log(sucursal.value)
    //Elimino los turnos
    //let options = listaTurno.querySelectorAll('option')
    //options.forEach(o => o.remove());


    //cargarTurnos(sucursal.value);
    
    labelTurno.style.display = "inline-block"
    listaTurno.style.display = "inline-block"
   
});
function cargarTurnos(idSucursal){
let turnos1 = ["Turno 1","Turno 2"]
let turnos2 = ["Turno 3","Turno 4"]
cont =1;
    if(idSucursal == 1){
     
     turnos1.forEach(element => {
      let option  = document.createElement('option')
      option.value = cont;
      option.text = element;
      listaTurno.appendChild(option);
      cont+=1;
     });
    }
    else{
  
      turnos2.forEach(element => {
        let option  = document.createElement('option')
        option.value = cont;
        option.text = element;
        listaTurno.appendChild(option);
        cont+=1;
       });
    }

}
(function cargarSucursales(){
  
  const request = fetch("http://localhost:3000/sucursales",{
    method: "GET",
    headers: {//'Accept': 'application/json',
   // 'Access-Control-Allow-Origin': '*'
            	
  }
  }

).then(res =>res.json())
.then(data => {
  console.log("JSON");
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


