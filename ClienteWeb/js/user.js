document.addEventListener('DOMContentLoaded',function(e){
  e.preventDefault();

  //var config = require("")
  var btnConfirm = document.getElementById("btn-confirm");
  var btnSolicitar = document.getElementById("btn-solicitar");
  var mapa = document.getElementById("map");
  var sucursal = document.getElementById("sucursales");
  var listaDia = document.getElementById("lista_dias");
  var listaHora = document.getElementById("lista_horas");
  var email = document.getElementById("email");
  var mapId = "b67e1717-7963-4d89-9f7f-fd765e55d68e";

  btnSolicitar.addEventListener('click',function(e){
    e.preventDefault();




    alert("Tiene dos minutos para conpletar sus datos y confirmar el turno");
  });
  btnConfirm.addEventListener('click',function(e){
      e.preventDefault();


      // Aqui deberia hacerse el post de la reserva
      // Primero debe hacerse la verifiacacion
      
      const request = fetch("http://localhost:3000/api/reservas/"+listaHora.value,{
        method: "POST",
        headers: {'Accept': 'application/json',
       // 'Content-type': 'text/html'
      },body:JSON.stringify({
        "userId" : 0,
        "email": email.value
      })
      }
    
    ).then(res =>{
      if(res.status == 200)
      alert("Turno confirmado correctamente");
      else
      alert("Hubo un problema, no se confirmo la reserva")
    })
    .catch( alert("Hubo un problema, no se confirmo la reserva"))

  


  });

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

  });


  function cargarDias(idSucursal){
    const request = fetch("http://localhost:3000/api/reservas/?branchId="+idSucursal+"&userId=-1",{
      method: "GET",
      headers: {'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*'    	
    }
    }
    )
    .then(res =>res.json())
    .then(data => {
      if(data.msg==undefined){
        let option  = document.createElement('option')
          option.value = 0;
          option.text = "Seleccione un dia";
        data.forEach(element => {
          let option  = document.createElement('option')
          option.value = element.id;
          let fecha = (element.datetime).split("T")
          option.text = fecha[0];
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
          option1.value = 0;
          option1.text = data.messageError;
          listaDia.appendChild(option1);
          let option2  = document.createElement('option')
          option2.value = 0;
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
    const request = fetch("http://localhost:3000/api/reservas/?branchId="+idSucursal+"&dateTime="+dia+"&userId=-1",{
      method: "GET",
      headers: {'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*'    	
    }
    }
    )
    .then(res =>res.json())
    .then(data => {
      let option  = document.createElement('option')
      option.value = 0;
      option.text = "Seleccione una hora";
      if(data.msg==undefined){
          
        data.forEach(element => {   let option  = document.createElement('option')
        option.value = element.id;
        let dia =  new Date(element.datetime);
        let hora = dia.getUTCHours();
        let minutos = dia.getUTCMinutes();
        if(minutos<10)
        minutos+="0"
        option.text = hora+ ":" + minutos;
        console.log(dia.toISOString())
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

//a77236b3-1a4b-4688-98cb-bbeb52fb1ac5
  //Prueba de mostrar el mapa de cartes.io
   /*
      var url = 'https://cartes.io/api/maps'
      const request = fetch(url,{
          method: "POST",
          headers: {'Accept': 'application/json',
         // 'Content-type': 'text/html'
         'Access-Control-Allow-Origin': '*'
        }
        }
      
      ).then(res =>res.json())
      .then(data => {console.log(data);mapa.src = "https://app.cartes.io/maps/"+data.uuid+"/embed?type=map&lat=-37.998768161736486&lng=-57.52020835876465&zoom=11"} )*/
});

//&lat=-36.264206799345125&lng=-58.03253173828126