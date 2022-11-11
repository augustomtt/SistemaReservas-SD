 
/*<div class="">
          <button id="login" class="btn btn-primary center-block">Registrarse/Loggearte</button>
          <button id="logout" class="btn btn-primary">Invitado</button>
        </div>*/
auth0.createAuth0Client({
  responseType: "token id_token",
  audience: "https://dev-pn7zgl7ckp8stzea.us.auth0.com/api/v2/", 
    domain: "dev-pn7zgl7ckp8stzea.us.auth0.com",
    clientId: "KMWqrOft0FpDJNmnzYriye6rOAQpXqQ9",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  }).then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("login");
  
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(window.location.origin)
      //console.log(authorizationParams.redirect_uri);
      //throw Error();
      auth0Client.loginWithRedirect();
    });
  
    if (location.search.includes("state=") && 
        (location.search.includes("code=") || 
        location.search.includes("error="))) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
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
    const profileElement = document.getElementById("profile");
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
  