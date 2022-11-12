document.addEventListener('DOMContentLoaded',function(e){
  e.preventDefault();
  /* <iframe id="map" src="https://app.cartes.io/maps/b67e1717-7963-4d89-9f7f-fd765e55d68e/embed?type=map&lat=-37.998768161736486&lng=-57.52020835876465&zoom=11" width="100%"
                height="400" frameborder="0"></iframe> */
  var btnConfirm = document.getElementById("btn-confirm");
  var btnSolicitar = document.getElementById("btn-solicitar");
  var mapa = document.getElementById("map");
  var sucursal = document.getElementById("sucursales");
  var listaDia = document.getElementById("lista_dias");
  var listaHora = document.getElementById("lista_horas");
  var email = document.getElementById("email");
  var mapId = "b67e1717-7963-4d89-9f7f-fd765e55d68e";
  var form = document.getElementById("subscribe");
  var datos = document.getElementById("datos");


  btnSolicitar.addEventListener('click',function(e){
    e.preventDefault();
    // chequear que no esten los campos vacios.
    
    // llamar a verifica turno, y bloquear recurso
    const request = fetch("http://localhost:3000/api/reservas/solicitar/"+listaHora.value,{
        method: "POST",
        headers: {'Accept': 'application/json',
       // 'Content-type': 'text/html'
      },body:JSON.stringify({
        "userId" : 0,
      })
      }
    
    ).then(res =>{
      if(res.status == 200){
        console.log(res.status);
        datos.style.display = "block";
        btnConfirm.style.display = "block";
        alert("Tiene dos minutos para conpletar sus datos y confirmar el turno");
      }
      else
        alert("1 Hubo un problema, no se pudo solicitar la reserva")
    })
    .catch( error => {alert("Hubo un problema, no se pudo solicitar la reserva");console.error(error)})
  });
  btnConfirm.addEventListener('click',function(e){
      e.preventDefault();
      console.log(email.value);
      //chequear que no esten los campos vacios
      
      const request = fetch("http://localhost:3000/api/reservas/confirmar/"+listaHora.value,{
        method: "POST",
        headers: {'Accept': 'application/json',
       // 'Content-type': 'text/html'
      },body:JSON.stringify({
        "userId" : 0,
        "email": email.value
      })
      }
    
    ).then(res =>{
      if(res.status == 200){
        alert("Turno confirmado correctamente");
        location.reload();
      }
      
      else
        alert("Hubo un problema, no se confirmo la reserva")
    })
    .catch( error => {alert("Hubo un problema, no se pudo solicitar la reserva");console.error(error)});
  });

  sucursal.addEventListener('change',function(e){
      e.preventDefault();
      //Elimino los turnos
      let optionsDia = listaDia.querySelectorAll('option')
      optionsDia.forEach(o => o.remove());
      let optionsHora = listaHora.querySelectorAll('option')
      optionsHora.forEach(o =>o.remove());
      //Cargar turnos de suscursal (comunicarse con api gateway)
      if(sucursal.value!=0)
      cargarDias(sucursal.value);
  });

  listaDia.addEventListener('change',function(e){
    e.preventDefault();
    let options = listaHora.querySelectorAll('option')
    options.forEach(o => {if(o.value!=0)o.remove()});
    if(listaDia.value!=0){
      let dia = listaDia.options[listaDia.selectedIndex].text;
      cargarHora(sucursal.value,dia);
    }
    

  });


  function cargarDias(idSucursal){
    const request = fetch("http://localhost:3000/api/reservas?branchId="+idSucursal+"&userId=-1",{
      method: "GET",
      headers: {'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*'    	
    }
    }
    )
    .then(res =>{
      if(res.status!=200) throw  Error(res.msg);

      return res;
    })
    .then(res =>res.json())
    .then(data => {
   
        let option  = document.createElement('option')
          option.value = 0;
          option.text = "Seleccione un dia";
          listaDia.append(option);
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
    )
  .catch(error => {
        alert("No hay turnos con para esa sucursal");
  });
  }

  function cargarHora(idSucursal,dia){
    const request = fetch("http://localhost:3000/api/reservas?branchId="+idSucursal+"&dateTime="+dia+"&userId=-1",{
      method: "GET",
      headers: {'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*'    	
    }
    }
    )
    .then(res =>{
      if(res.status!=200) throw  Error(res.msg);

      return res;
    })
    .then(res =>res.json())
    .then(data => {
      let option  = document.createElement('option')
      option.value = 0;
      option.text = "Seleccione una hora";
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