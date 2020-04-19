function onSignIn(googleUser) 
{
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $.ajax({
        method : 'POST',
        url : baseUrl + 'googleSign',
        data : {
            id_token
        }
    })
    .done(data =>
    {
        console.log("Succes", data);
        localStorage.setItem("accessToken", data.accessToken);
        authentication();
    })
    .fail(err =>
    {
        console.log("Error", err);
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }