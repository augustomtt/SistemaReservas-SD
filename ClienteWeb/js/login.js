function Hash(email) {
    var hash = 0;
    if (email.length == 0) return hash;
    for (i = 0; i < email.length; i++) {
        char = email.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Lo convierte a un entero de 32 bit 
    }
    return (hash<0)?hash*-1:hash;
}


/* <div class="">
          <button id="login" class="btn btn-primary center-block">Registrarse/Loggearte</button>
          <button id="logout" class="btn btn-primary">Invitado</button>
        </div>*/
auth0
  .createAuth0Client({
    //responseType: "code",
    //audience: "https://dev-pn7zgl7ckp8stzea.us.auth0.com/api/v2/",
    domain: "dev-pn7zgl7ckp8stzea.us.auth0.com",
    clientId: "KMWqrOft0FpDJNmnzYriye6rOAQpXqQ9",
    authorizationParams: {
      redirect_uri: window.location.origin + '#/logeado',
    },
  })
  .then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("login");

    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(window.location.origin);
      auth0Client.loginWithRedirect().then(token => {console.log(token)
        });
    });

    if (location.search.includes("state=") &&
      (location.search.includes("code=") ||
        location.search.includes("error="))) {
      auth0Client.handleRedirectCallback().then((token) => {
        auth0Client.getIdTokenClaims().then(sessionData => {
          console.log(token)
          console.log(sessionData)
          if (sessionData) {
            window.sessionStorage.setItem('token', sessionData.__raw)
            window.sessionStorage.setItem('email', sessionData.email)
            window.sessionStorage.setItem('userId', Hash(sessionData.email))
          }
          window.history.replaceState({}, document.title, "/");
          window.location.href = "#/logeado";
         
        });
      });
    }

    // Assumes a button with id "logout" in the DOM

    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.logout();
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();

    // Assumes an element with id "profile" in the DOM
    //const profileElement = document.getElementById("profile");
    /*
    if (isAuthenticated) {
      profileElement.style.display = "block";
      profileElement.innerHTML = `
              <p>${userProfile.name}</p>
              <img src="${userProfile.picture}" />
            `;
    } else {
      profileElement.style.display = "none";
    }*/
  });
