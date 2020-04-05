const localhost = 'http://localhost:3000'
const heroku = 'nanti ya'

function showLandingPage() {
    $('#landing-page').show()
    $('#register-page').hide()
    $('#dashboard').hide()
}
function showRegister(event) {
    event.preventDefault()
    $('#register-page').show()
    $('#landing-page').hide()
    $('#dashboard').hide()
}
function showDashboard() {
    console.log('masuk dashboard')
    $('#username').empty()
    $('#pic').empty()
    $('#username').append(`${localStorage.getItem('email')}`)
    $('#pic').append(`<img width="25" height="25" src="${localStorage.getItem('avatar')}">`)
    $('#dashboard').show()
    $('#register-page').hide()
    $('#landing-page').hide()
    getTasks()
}

function getTasks() {
    console.log('dapat task')
    $('#tasks-list').empty()
    $.ajax({
        method: 'GET',
        url: `${localhost}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        $('#tasks-list').append(response)
    })
    .fail(err => {
            console.log(err)
    })
}

function login(event) {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${localhost}/login`,
        data: {
            email: $('#email-login').val(),
            password: $('#password-login').val()
        }
    }).done(response => {
        $('#email-login').val('')
        $('#password-login').val('')
        console.log(response)
        localStorage.setItem("avatar", response.avatar)
        localStorage.setItem("email", response.email)
        localStorage.setItem("token", response.token)
        showDashboard()
    })
    .fail(err => {
        console.log(err, "login error")
        err.responseJSON.forEach(el => {
            $('#error-message').append(`${el}<br>`)
            $('#alert').fadeTo(2000, 500).slideUp(500, function() {
                $("#alert").slideUp(500);
                $('#error-message').empty()
            })
        })
    })
}
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    $.ajax({
            method: "POST",
            url: `${localhost}/googleSignIn`,
            headers: {
                token: id_token
            }
        }).done(function(response) {
            console.log({
                response: response,
                msg: "Sent google token to server. Received server token."
            })
            localStorage.setItem("avatar", response.avatar)
            localStorage.setItem("token", response.token)
            showDashboard()
        })
        .fail(function(err) {
            console.log(err, "<= It's an error on google signin")
            err.responseJSON.forEach(el => {
                $('#error-message').append(`${el}<br>`)
                $('#alert').fadeTo(2000, 500).slideUp(500, function() {
                    $("#alert").slideUp(500);
                    $('#error-message').empty()
                })
            })
        })
}

function logout(event) {
    event.preventDefault()
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    showLandingPage()
}

$(document).ready(function() {
    showLandingPage()
    $('#alert').hide()
    let token = localStorage.getItem('token')
    if(!token) {
        showLandingPage()
    } else {
        showDashboard()
    }
})