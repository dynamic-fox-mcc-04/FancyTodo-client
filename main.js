const localhost = 'http://localhost:3000'
const heroku = 'nanti ya'

function showLandingPage() {
    $('#landing-page').show()
    $('#register-page').hide()
    $('#dashboard').hide()
}
function showRegister(event, id) {
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
        $('#success-message').append(`${response.title} added.`)
        $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
            $("#success-box").slideUp(500);
            $('#success-message').empty()
        })
        getTasks()
    }).fail(err => {
        console.log(err, "adding task error")
        $('#error-message').append(`${err.responseJSON}`)
        $('#alert').fadeTo(4000, 500).slideUp(500, function() {
            $("#alert").slideUp(500);
            $('#error-message').empty()
        })
    })
}

function complete(id) {
    $.ajax({
        method: 'GET',
        url: `${localhost}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        $.ajax({
            method: 'PUT',
            url: `${localhost}/todos/${response.id}`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                title: response.title,
                description: response.description,
                due_date: response.due_date,
                status: true
            }
        })
    }).done(response => {
        $('#success-message').append(`Item moved to finished!`)
        $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
            $("#success-box").slideUp(500);
            $('#success-message').empty()
        })
        getTasks()
    }).fail(err => {
        console.log(err)
    })
    console.log('bisa diedit')
}

function deleteTask(event, id) {
    event.preventDefault()
    console.log(id, 'bisa didelete')
    $.ajax({
        method: 'DELETE',
        url: `${localhost}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        console.log(response)
        $('#success-message').append(`Item successfully deleted!`)
        $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
            $("#success-box").slideUp(500);
            $('#success-message').empty()
        })
        getTasks()
    }).fail(err =>{
        console.log(err)
    })
}

function showEdit(id) {
    $.ajax({
        method: 'GET',
        url: `${localhost}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        $('#title-edit').val(response.title)
        $('#description-edit').val(response.description)
        console.log(response.due_date)
        $('#date-edit').val(response.due_date.split('T')[0])
        localStorage.setItem('id-edit', response.id)
    }).fail(err => {
        console.log(err)
    })
    $('#edit-task').fadeTo(2000, 500)
}

function editTask() {
    $.ajax({
        method: 'PUT',
        url: `${localhost}/todos/${localStorage.getItem('id-edit')}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: $('#title-edit').val(),
            description: $('#description-edit').val(),
            due_date: $('#date-edit').val(),
            status: $('#status-edit').val()
        }
    }).done(response => {
        $('#title-edit').val(''),
        $('#description-edit').val(''),
        $('#date-edit').val(''),
        $('#status-edit').val('')
        localStorage.removeItem('id-edit')
        $('#success-message').append(`Item successfully edited!`)
        $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
            $("#success-box").slideUp(500);
            $('#success-message').empty()
        })
        $('#edit-task').slideUp(500)
        getTasks()
    }).fail(err => {
        console.log(err)
    })
}

function closeEdit(event) {
    $('#edit-task').slideUp(500)
}

function getTasks() {
    console.log('dapat task')
    $('#tasks-list').empty()
    $('#tasks-list-done').empty()
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
            let send = {
                id: el.id,
                title: el.title,
                description: el.description,
                due_date: el.due_date,
                status: el.status
            }
            let completed = ''
            let created = new Date(el.createdAt)
            let due = new Date(el.due_date)
            let toAppend = `
            <div class="card task-item">
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
    <button onclick="complete(${send.id})" class="button card-footer-item">Complete</button>
    <button onclick="showEdit(${send.id})" class="button card-footer-item">Edit</button>
    <button onclick="deleteTask(event, ${send.id})" class="button card-footer-item">Delete</button>
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
        getJokes()
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
        $('#email-login').val('')
        $('#password-login').val('')
        console.log(err, "login error")
        $('#error-message').append(`${err.responseJSON.msg}`)
        $('#alert').fadeTo(4000, 500).slideUp(500, function() {
            $("#alert").slideUp(500);
            $('#error-message').empty()
        })
    })
}

function register(event) {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${localhost}/register`,
        data: {
            email: $('#email-register').val(),
            password: $('#password-register').val()
        }
    }).done(response => {
        $('#email-register').val('')
        $('#password-register').val('')
        console.log(response)
        localStorage.setItem("avatar", response.avatar)
        localStorage.setItem("email", response.email)
        localStorage.setItem("token", response.token)
        $('#success-message').append(`${response.email} registered!`)
        $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
            $("#success-box").slideUp(500);
            $('#success-message').empty()
        })
        showDashboard()
    })
    .fail(err => {
        $('#email-register').val('')
        $('#password-register').val('')
        console.log(err, "register error")
        $('#error-message').append(`${err.responseJSON.msg}`)
        $('#alert').fadeTo(4000, 500).slideUp(500, function() {
            $("#alert").slideUp(500);
            $('#error-message').empty()
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
            localStorage.setItem("email", response.email)
            localStorage.setItem("token", response.token)
            showDashboard()
        })
        .fail(function(err) {
            console.log(err, "<= It's an error on google signin")
            $('#error-message').append(`${err.responseJSON}`)
            $('#alert').fadeTo(4000, 500).slideUp(500, function() {
                $("#alert").slideUp(500);
                $('#error-message').empty()
            })
        })
}

function getJokes() {
    $('#joke-setup').empty()
    $('#joke-punchline').empty()
    $.ajax({
        method: 'GET',
        url: `${localhost}/jokes`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(response => {
        $('#joke-setup').append(response.setup)
        $('#joke-punchline').append(response.punchline)
        $('#loading').hide()
    }).fail(err => {
        console.log(err, 'joke error lmao')
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
    $('#success-message').append(`Logged out`)
    $('#success-box').fadeTo(4000, 500).slideUp(500, function() {
        $("#success-box").slideUp(500);
        $('#success-message').empty()
    })
}

$(document).ready(function() {
    showLandingPage()
    $('#alert').hide()
    $('#success-box').hide()
    $('#loading').hide()
    $('#edit-task').hide()
    let token = localStorage.getItem('token')
    if(!token) {
        showLandingPage()
    } else {
        showDashboard()
    }
})