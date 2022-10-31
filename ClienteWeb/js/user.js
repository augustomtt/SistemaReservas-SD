var btnConfirm = document.getElementById("btn-confirm")
var mapa = document.getElementById("map")
var sucursal = document.getElementById("sucursales")
var listaDia = document.getElementById("lista_dias")
var listaHora = document.getElementById("lista_horas")



btnConfirm.addEventListener('click',function(e){
    e.preventDefault();
    alert("Turno Confirmado");


})

sucursal.addEventListener('change',function(e){
    e.preventDefault();
    //Elimino los turnos
    let optionsDia = listaDia.querySelectorAll('option')
    optionsDia.forEach(o => {if(o.value!=0)o.remove()});
    let optionsHora = listaHora.querySelectorAll('option')
    optionsHora.forEach(o => {if(o.value!=0)o.remove()});
    //Cargar turnos de suscursal (comunicarse con api gateway)
    if(sucursal.value!=0)
    cargarDias(sucursal.value);
});

listaDia.addEventListener('change',function(e){
  e.preventDefault();
  let options = listaHora.querySelectorAll('option')
  options.forEach(o => {if(o.value!=0)o.remove()});
  if(listaDia.value!=0)
  cargarHora(sucursal.value,listaDia.text);

})


function cargarDias(idSucursal){
  const request = fetch("http://localhost:3000/api/reserva/?branchId="+idSucursal+"&userId=",{
    method: "GET",
    headers: {'Accept': 'application/json',
   // 'Access-Control-Allow-Origin': '*'    	
  }
  }
  )
  .then(res =>res.json())
  .then(data => {
     if(data.messageError==undefined){
      data.forEach(element => {
        let option  = document.createElement('option')
        option.value = element.id;
        option.text = new Date(element.datetime).toLocaleDateString();
        let options = listaDia.querySelectorAll('option');
        encontro = false;
        options.forEach(o => {if(o.text==option.text)
           encontro = true;
          })
          if(!encontro) // para no repetir dias
          listaDia.appendChild(option)
        });
      }
      else{
        let option1  = document.createElement('option')
        option1.value = 1;
        option1.text = data.messageError;
        listaDia.appendChild(option1);
        let option2  = document.createElement('option')
        option2.value = 1;
        option2.text = data.messageError;
        listaHora.appendChild(option2);
      } 
    }
  )
.catch(error => console.error(error));
}
/*then(res => {
    if(res.status != 200)
      throw new Error("Error");
  
  }) */
function cargarHora(idSucursal,dia){
  const request = fetch("http://localhost:3000/api/reserva/?branchId="+idSucursal+"&dateTime="+dia+"&userId=",{
    method: "GET",
    headers: {'Accept': 'application/json',
   // 'Access-Control-Allow-Origin': '*'    	
  }
  }
  )
  .then(res =>res.json())
  .then(data => {
     if(data.messageError==undefined){
        
      data.forEach(element => {   let option  = document.createElement('option')
      option.value = element.id;
      option.text = new Date(element.datetime).getHours().toString();
      listaHora.appendChild(option);})
     //.toLocaleDateString();
      
      
      }
      else{
        let option  = document.createElement('option')
        option.value = 0;
        option.text = data.messageError;
        listaHora.appendChild(option)
      } 
    }
  )
.catch(error => console.error(error));
}
(function cargarSucursales(){
  
  const request = fetch("http://localhost:3000/api/sucursales",{
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
      /*
      var url = 'https://cartes.io/api/maps'
    const request = fetch(url,{
        method: "GET",
        headers: {'Accept': 'application/json',
        'Content-type': 'text/html'
      }
      }
    
    ).then(res =>res.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));   */