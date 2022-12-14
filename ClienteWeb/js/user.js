document.addEventListener('DOMContentLoaded', function (e) {
  e.preventDefault();
  var btnConfirm = document.getElementById("btn-confirm");
  var btnSolicitar = document.getElementById("btn-solicitar");
  var btnBaja = document.getElementById("btn-baja");
  var misReservas = document.getElementById('mis-reservas');
  var mapa = document.getElementById("map");
  var sucursal = document.getElementById("sucursales");
  var listaDia = document.getElementById("lista_dias");
  var listaHora = document.getElementById("lista_horas");
  var listaReservas = document.getElementById("lista_reservas");
  var email = document.getElementById("email");
  var datos = document.getElementById("datos");
  var port;
  var userId;
  var token;
  var header;
  window.addEventListener('hashchange',()=>{
    this.location.reload();
});
  if (window.location.hash == '#/invitado') { 
    port = 3000
    userId = 0
    header = {
      'Accept': 'application/json',
    };
    email.value ="";
    email.removeAttribute("readonly")
  } else {
    port = 3001
    userId = window.sessionStorage.getItem('userId');
    token = window.sessionStorage.getItem('token');
    email.value = window.sessionStorage.getItem('email');
    email.setAttribute("readonly",""); // para que no se pueda cambiar
    console.log("token recuperado " + token);
    header = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
  }
  
  // faltaria cambiar el puerto aca
  misReservas.addEventListener('click',function(e){
  e.preventDefault();
  window.location.hash = "#/reservas";
  //mostrar reservas
    cargarReservas();
  });

  btnSolicitar.addEventListener('click',function(e){
    e.preventDefault();
    // chequear que no esten los campos vacios.
    
    // llamar a verifica turno, y bloquear recurso
    
    const request = fetch(`http://localhost:${port}/api/reservas/solicitar/`+listaHora.value,{
      method: "POST",
      headers: header,
      body:JSON.stringify({
        "userId" : userId,
      })
      }   
    
    ).then(res =>{
      if(res.status == 200){
        console.log(res.status);
        datos.style.display = "block";
        btnConfirm.style.display = "block";
        alert("Tiene dos minutos para completar sus datos y confirmar el turno");
      }
      else
        alert("Hubo un problema, no se pudo solicitar la reserva")
    })
    .catch( error => {alert("Hubo un problema, no se pudo solicitar la reserva");console.error(error)})
  });

  btnConfirm.addEventListener('click',function(e){
      e.preventDefault();
      
      //chequear que no esten los campos vacios
      
      const request = fetch(`http://localhost:${port}/api/reservas/confirmar/`+listaHora.value,{
        method: "POST",
        headers: header,
        body: JSON.stringify({
        "userId" : userId,
        "email": email.value
      })
      }
    
    ).then(res =>{
      if(res.status == 200){
        alert("Turno confirmado correctamente");
        location.reload();
      }
      else{
        alert("No se pudo confirmar ya que paso el tiempo");
        location.reload();
      }
       
    })
    .catch( error => {alert("Hubo un problema, no se pudo confirmar la reserva");console.error(error)});
  });

// falta cambiar el puerto.
  btnBaja.addEventListener('click',function(e){
    userId = window.sessionStorage.getItem('userId');
    //token = window.sessionStorage.getItem('token');
    e.preventDefault();
    let idReserva = listaReservas.value;
    if(idReserva!=''){
      let opcion = confirm("Seguro que desea dar de baja?");
        if(opcion){
       fetch(`http://localhost:${port}/api/reservas/`+idReserva,{
          method: "DELETE",
          headers: header,
          body: JSON.stringify({
            "userId" : userId
          })
        })
        .then(res => {
          if(res.status!=200)
              alert("Error en la baja de la reserva");
          else{
            alert("Reserva dada de baja con exito");
            location.reload();
          }
        }
        )
        .catch((error) => console.error(error));
        
     }
    }
    else{
      alert("No hay ninguna reserva seleccionada");
    }
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
    const request = fetch(`http://localhost:${port}/api/reservas?branchId=`+idSucursal+"&userId=-1",{
      method: "GET",
      headers: header
    }
    )
    .then(res =>{
      if(res.status!=200) throw  Error();

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
          option.value = element.idReserva; //INTERFACES 
          let fecha = (element.dateTime).split("T")
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
        console.error(error);
  });
  }

  function cargarHora(idSucursal,dia){
    const request = fetch(`http://localhost:${port}/api/reservas?branchId=`+idSucursal+"&dateTime="+dia+"&userId=-1",{
      method: "GET",
      headers: header
    }
    )
    .then(res =>{
      if(res.status!=200) throw  Error();

      return res;
    })
    .then(res =>res.json())
    .then(data => {
      let option  = document.createElement('option')
      option.value = 0;
      option.text = "Seleccione una hora";
        data.forEach(element => {   let option  = document.createElement('option')
        option.value = element.idReserva; //INTERFACES
        let dia =  new Date(element.dateTime);
        let hora = dia.getHours();
        let minutos = dia.getMinutes();
        if(minutos<10)
          minutos="0"+minutos
        option.text = hora+ ":" + minutos;
        console.log(dia.toISOString())
        listaHora.appendChild(option);})
      }
    )
  .catch(error => console.error(error));
  }
  
  function cargarReservas(){
    
    let options = listaReservas.querySelectorAll('option')
  options.forEach(o => o.remove());
    const request = fetch(`http://localhost:${port}/api/reservas?userId=`+window.sessionStorage.getItem('userId'),{
        method: "GET",
        headers: header

  })
  .then(res =>{
    if(res.status!=200) throw  Error();

    return res;
  })
  .then(res =>res.json())
  .then(data =>{
    data.forEach(element => {
      let option  = document.createElement('option');
      option.value = element.idReserva; //INTERFACES
      let fecha = (element.dateTime).split("T");
      let dia =  new Date(element.dateTime);
      let hora = dia.getHours();
      let minutos = dia.getMinutes();
      if(minutos<10)
        minutos="0"+minutos;
      option.text = `${fecha[0]} ---- ${hora}:${minutos}`;
      listaReservas.append(option)
    })
  })
  .catch(error =>{alert("No se encuentra ninguna reserva");console.error(error)});
  }
 
  function cargarSucursales(mapId){
    
    const request = fetch(`http://localhost:${port}/api/sucursales`,{
      method: "GET",
      headers: header,
    // 'Access-Control-Allow-Origin': '*'    	
    
    }
    ).then(res =>res.json())
    .then(data => {
    data.forEach(element => {

      var url = 'https://cartes.io/api/maps/'+mapId+"/markers"
      const request = fetch(url,{
          method: "POST",
          headers: {'Accept': 'application/json',
          'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*'
        },body:JSON.stringify({
          "lat": element.lat,
          "lng": element.lng,
          "category_name":element.name
         })
        }
      
      ).then(res =>res.json())
      .then(data => {console.log(data)} )

      let option  = document.createElement('option')
      option.value = element.id;
      option.text = element.name;
    sucursal.appendChild(option)
      });
    }
    )
  .catch(error => console.error(error));

  }
  //Prueba de mostrar el mapa de cartes.io
     if(window.location.hash == "#/invitado" || window.location.hash == "#/logeado"){
    
      // chequear si esta cargado el mapa
        
      var url = 'https://cartes.io/api/maps'
       fetch(url,{
          method: "POST",
          headers: {'Accept': 'application/json',
          'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*'
        },body:JSON.stringify({
          "privacy": "public",
          "users_can_create_markers":"yes"
         }) 
        }
      
      ).then(res =>res.json())
      .then(data => {mapa.src = "https://app.cartes.io/maps/"+data.uuid+"/embed?type=map&lat=-37.998768161736486&lng=-57.52020835876465&zoom=12"; cargarSucursales(data.uuid)} )
      .catch(error => console.error(error));
    }

      if(window.location.hash == "#/reservas"){
         cargarReservas();
      }


});

