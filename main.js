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
    $('#username').empty()
    $('#pic').empty()
    $('#username').append(`${localStorage.getItem('email')}`)
    $('#pic').append(`<img width="25" height="25" src="${localStorage.getItem('avatar')}">`)
    $('#dashboard').show()
    $('#register-page').hide()
    $('#landing-page').hide()
    getTasks()
}

function addTask(event) {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${localhost}/todos`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: $('#title-add').val(),
            description: $('#description-add').val(),
            due_date: $('#date-add').val()
        }
    }).done(response => {
        console.log(response, 'added')
        $('#title-add').val('')
        $('#description-add').val('')
        $('#date-add').val('')
        getTasks()
    }).fail(err => {
        console.log(err, "adding task error")
        err.responseJSON.forEach(el => {
            $('#error-message').append(`${el}<br>`)
            $('#alert').fadeTo(2000, 500).slideUp(500, function() {
                $("#alert").slideUp(500);
                $('#error-message').empty()
            })
        })
    })
}

function complete(event, arr) {
    event.preventDefault()
    console.log(arr)
}

function getTasks() {
    console.log('dapat task')
    $('#tasks-list').empty()
    $('#loading').show()
    $.ajax({
        method: 'GET',
        url: `${localhost}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        console.log(response, 'ini todo nya')
        response.forEach(el => {
            let completed = ''
            let created = new Date(el.createdAt)
            let due = new Date(el.due_date)
            let toAppend = `
            <div class="card">
  <header class="card-header">
    <p class="card-header-title">
      ${el.title}  ${completed}
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      ${el.description}<br><br>
      <b>Added on:</b><br>
      <time datetime="${el.createdAt}">${created.toDateString()}</time><br>
      <b>Due on:</b><br>
      ${due.toDateString()}<br>
    </div>
  </div>
  <footer class="card-footer">
    <button onclick="complete(event, [${el.id}, ${el.title}, ${el.description}, ${el.due_date}])" class="button card-footer-item">Complete</button>
    <button class="button card-footer-item">Edit</button>
    <button class="button card-footer-item">Delete</button>
  </footer>
</div>
            `
            if(el.status === false) {
                completed = `<span class="tag status is-pulled-right is-danger">Not Done</span>`
                $('#tasks-list').append(toAppend)
            } else {
                completed = `<span class="tag status is-pulled-right is-success">Done</span>`
                $('#tasks-list-done').append(toAppend)
            }
            
        })
        $('#loading').hide(4000)
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
    $('#loading').hide()
    let token = localStorage.getItem('token')
    if(!token) {
        showLandingPage()
    } else {
        showDashboard()
    }
})