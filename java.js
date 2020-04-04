let baseUrl = 'http://localhost:3000'

$(document).ready(function() {
    console.log(`masuk ke doc ready`)
    auth()
})

const hideElement = (element) => {
    return $(element).hide()
}
const showElement = (element) => {
    return $(element).show()
}
const hideShowElement = (target, hide, show) => {

    $(target).on('click', (e) => {
        e.preventDefault()
        console.log('masuk hide show')
        hideElement(hide)
        showElement(show)
    })
}


// ====== MULAI ========\
function auth() {
    if (localStorage.getItem('token')) {
        hideElement('.container-fluid')
        showElement('#form-right')
        hideElement('#form-add-right')
        showElement('#wrap-main')
        $('body').css('background-image', 'url(./assets/bg23.jpg)');
        getUser()
        getTodo()
    } else {
        console.log(`masuk ke auth not get token yet`)
        $('body').css('background-image', 'url(./assets/back.jpg)');
        showElement('.container-fluid')
        hideElement('#signup-form-container')
        hideElement('#login-form-container')
        hideElement('#wrap-main')
        hideElement('#form-right')
        hideShowElement('#signup-form-btn', '#login-form-container', '#signup-form-container')
        hideShowElement('#signin-form-btn', '#signup-form-container', '#login-form-container')
    }
}


$('.authModal').click(function() {
    $('#signup-form-container').fadeToggle()

})



function signOut() {
    localStorage.clear()
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
    auth()
}

$(`#signup-btn`).click((e) => {
    e.preventDefault()
    console.log(`masuk register`)
    let email = $(`#email-signup`).val()
    let password = $(`#password-signup`).val()
    console.log(email, password)


    // if ($(`#email-signup`).val() === '' || $(`#password-signup`).val() === '') {
    //     return authnotifications('Sorry!! all fields are required!')
    // }
    $(`#signup-form .auth-notifications`).empty()
    $('#signup-btn').addClass('loading')
    $.ajax({
            method: 'post',
            url: baseUrl + '/users/register',
            data: {
                email,
                password
            }
        })
        .done(user => {
            console.log(">>>>>>", user)
            localStorage.setItem('token', user.token)
                //         $(`#signup-form .auth-notifications`).append(`
                // <div class="ui success message">
                // <p>${user.email} successfully registered!</p>
                // </div>
                // `)

            $(`#email-signup`).val('')
            $(`#password-signup`).val('')
            $(`#signup-form .auth-notifications`).html('')
            auth()
        })
        .fail(err => {
            console.log(err)
            $(`#signup-form .auth-notifications`).html(`
                <div class="ui error message error-notif">
                <p>${err.responseJSON.errors[0].message}</p>
                </div>
    `)
        })
        .always(_ => {
            $('#signup-btn').removeClass('loading')
        })
})

//LOGIN 
$(`#signin-btn`).click(e => {
    e.preventDefault()
    console.log('masuk login')
        // $(`#login-form .auth-notifications`).empty()
        // if ($(`#email-login`).val() === '' || $(`#password-login`).val() === '') {
        //     return loginnotif('Sorry!! all fields are required!')
        // }

    $(`#login-form .auth-notifications`).empty()
    $('#signin-btn').addClass('loading')
    $.ajax({
            method: 'post',
            url: baseUrl + '/users/login',
            data: {
                email: $(`#email-login`).val(),
                password: $(`#password-login`).val()
            }
        })
        .done((user) => {
            localStorage.setItem('token', user.token)
            $(`#email-signin`).val('')
            $(`#password-signin`).val('')
            auth()
            getUser()
            getTodo()

        })
        .fail(err => {
            console.log(err)
            loginnotif(err.responseJSON.errors[0].message)
        })
        .always(_ => {
            $('#signin-btn').removeClass('loading')
        })
})

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
            method: 'post',
            url: baseUrl + '/users/googleLogin',
            data: {
                id_token
            }
        })
        .done((user) => {
            localStorage.setItem('token', user.token)
            auth()
        })
        .fail(err => {
            loginnotif(err.responseJSON.errors[0].message)
        })
        .always(_ => {
            $('#signup-btn').removeClass('loading')
        })
}


function authnotifications(msg) {
    $(`#signup-form .auth-notifications`).append(`
        <div class="ui error message error-notif">
        <p>${msg}</p>
        </div>`)
}

function loginnotif(msg) {
    $(`#login-form .auth-notifications`).append(`
    <div class="ui error message error-notif">
    <p>${msg}</p>
    </div>`)
}

function getMoment(date) {
    // moment().format();
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return "a few seconds ago";
}

function formnotif(msg) {
    console.log(msg)
    $(`#form-notifications`).html(`
        <div class="ui error message error-notif">
        <p>${msg}</p>
        </div>`)
}

function formnotifedit(msg) {
    console.log(msg)
    $(`#form-notifications-edit`).html(`
        <div class="ui error message error-notif">
        <p>${msg}</p>
        </div>`)
}

function formnotifsuccess(msg) {
    $(`#form-notifications`).html(`
        <div class="ui success message">
        <p>${msg}</p>
        </div>`)
}


function deletefail(msg) {
    $(`#deletesuccessnotif`).html(`
        <div class="ui error message">
        <p>${msg}</p>
        </div>`)
}

function getUser() {
    console.log('masuk get user')

    $.ajax({
            method: 'get',
            url: `http://localhost:3000/users`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(user => {
            console.log(user)
            $(`#user-profile`).html(
                `<div id="user-container">
                    <div id="profile">
                        <h5>Hi, ${user.Users[0].email}</h5>
                        <p class="signout-btn" onclick="signOut()">
                        sign out!
                        </p>
                    </div>
                </div>
                <div id="weather">
                    <img src="https://www.weatherbit.io/static/img/icons/${user.weather.weather.icon}.png" alt="">
                    <div id=weather-content>
                        <h4>${user.weather.weather.description}</h4>
                        <p>${user.weather.city_name} ${user.weather.country_code}<p>
                        <p>${user.weather.timezone}</p>
                        <p>temperature : ${user.weather.temp}°C</p>
                    </div>
                </div>
                `
            )
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteTodo(id) {
    $.ajax({
            method: 'delete',
            url: `http://localhost:3000/todos/${id}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(`result message delete:`, result.message)
            getTodo()
            formnotifsuccess(`${result.message}`)
        })
        .fail(err => {
            formnotif(err.msg)
        })
}

function findById(id, description) {
    $.ajax({
            method: 'get',
            url: `http://localhost:3000/todos/${id}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            $('.modal-body').empty()
            $('#exampleModalLabel').html(`${result.Movie_Description.Title}`)
            $('.modal-body').append(`
            <div class="card" style="width: 18rem;">
            <img src="${result.Movie_Description.Poster}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Released Year: ${result.Movie_Description.Year}</h5>
              <h6>Todo Description: </h6>
              <p class="card-text">${description}</p>
            </div>
          </div>`)

        })
        .fail(err => {
            formnotif(err.msg)
        })
}


function updateTodo(id) {
    console.log(`id`, id)
    $('.modal-body').empty()
    $('.modal-body').append(
            `<form action="" class="ui form" id="todo-form">
            <div class="field">
                <input type="text" id="title-edit" autocomplete="off" placeholder="tittle">
            </div>
            <div class="field">
                <textarea rows="2" style="margin-top: 0px; margin-bottom: 0px; height: 30px;" placeholder="description here.." id="description-edit"></textarea>
            </div>
            <div class="inline field">
                <label for="due-date-edit">due date</label>
                <input type="date" id="due-date-edit" placeholder="due date" style="width: 89%">
            </div>
            <button type="submit" data-dismiss="modal" class="fluid ui primary button" id="update-btn" onclick="updateData(event,'${id}')">Edit</button>
        </form>`)
        // $('#wrap-main').append(
        //     `<form action="" class="ui form" id="todo-form">
        //     <div class="field">
        //         <input type="text" id="title-edit" autocomplete="off" placeholder="tittle">
        //     </div>
        //     <div class="field">
        //         <textarea rows="2" style="margin-top: 0px; margin-bottom: 0px; height: 30px;" placeholder="description here.." id="description-edit"></textarea>
        //     </div>
        //     <div class="inline field">
        //         <label for="due-date-edit">due date</label>
        //         <input type="date" id="due-date-edit" placeholder="due date" style="width: 89%">
        //     </div>
        //     <button type="submit" class="fluid ui primary button" id="update-btn" onclick="updateData('${id}')">Edit</button>
        // </form>`)
}

function updateData(e, id) {
    e.preventDefault()
    if ($(`#title-edit`).val() === '' || $(`#description-edit`).val() === '' || $(`#due-date-edit`).val() === '') {
        console.log('masuk update todo')
        return formnotif(`Sorry!! all fields are required`)
    }
    $.ajax({
            method: 'put',
            url: `http://localhost:3000/todos/${id}`,
            data: {
                title: $(`#title-edit`).val(),
                description: $(`#description-edit`).val(),
                due_date: $(`#due-date-edit`).val()

            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            $(`#title-edit`).val('')
            $(`#description-edit`).val('')
            $(`#due-date-edit`).val('')
            $(`#status-edit`).val('')
            getTodo()
            formnotifsuccess(`${result.message}`)
        })
        .fail(err => {
            console.log(err)
            formnotif(err.responseJSON.errors[0].message)
        })
}

// function addForm() {
$(`.btn-add`).click(e => {
    $('#form-add-right').fadeToggle()
    $('#form-notifications').html('')
})

// create todo
$('#todo-form').on("submit", e => {
    e.preventDefault()
    $('#form-notifications').html('')
    if ($(`#title`).val() === '' || $(`#description`).val() === '' || $(`#due-date`).val() === '') {
        console.log('masuk')
        return formnotif(`Sorry!! all fields are required`)
    }

    $.ajax({
            method: 'post',
            url: `http://localhost:3000/todos`,
            data: {
                title: $(`#title`).val(),
                description: $(`#description`).val(),
                due_date: $(`#due-date`).val()
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(`msg create success:`, result.message)
            getTodo()
            formnotifsuccess(`${result.message}`)

        })
        .fail(err => {
            console.log(err)
            formnotif(err.responseJSON.errors[0].message)
            $(`#title`).val('')
            $(`#description`).val('')
            $(`#due-date`).val('')
            $(`#form-notifications`).val('')
        })
        .always(_ => {
            $(`#title`).val('')
            $(`#description`).val('')
            $(`#due-date`).val('')
            $(`#form-notifications`).val('')
        })
})



//get todo => include = delete todo , update status todod
function getTodo() {
    $('#form-notifications').html('')
    console.log('masuk get todo')

    $.ajax({
            method: 'get',
            url: `http://localhost:3000/todos`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(`initodos`, result)
            $(`#todo`).empty()
            let todos = result.Todos
            console.log(todos)
            todos.forEach(todo => {
                $(`#todo`).append(`
                <div class="card text-white bg-primary mb-3" style="max-width: 100%;" id="card-todo">
                    <div class="card-header">
                        <h4>${todo.title}</h4>
                        <p>${getMoment(todo.createdAt)}</p>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">Due Date     : ${todo.due_date}</h6>
                        <div class="todo-link">
                            <a><span id="${todo.id}" style="color:#008080;  font-size:12px;" class="a-todo">${!todo.status ? "undone":"done"}</span></a>
                            <a data-toggle="modal" data-target="#exampleModal"><span onclick="findById('${todo.id}','${todo.description}')" class="a-todo">detail</span></a>
                            <a><span id="${todo.id}delete" onclick="deleteTodo('${todo.id}')" class="a-todo">delete</span></a>
                            <a data-toggle="modal" data-target="#exampleModal"><span id="${todo.id}edit" onclick="updateTodo('${todo.id}')" class="a-todo">edit</span></a>
                            
                        </div>
                    </div>
              </div>
            `)

                //HOVER EFFECT
                $(`#${todo.id}`).hover(() => {
                    if (!todo.status) $(`#${todo.id}`).html("done")
                    else $(`#${todo.id}`).html("undone")
                }, () => {
                    if (!todo.status) $(`#${todo.id}`).html("undone")
                    else $(`#${todo.id}`).html("done")
                })

                //CHANGE STATUS AJAX
                $(`#${todo.id}`).on('click', () => {
                    !todo.status ? todo.status = true : todo.status = false
                    $.ajax({
                            method: 'patch',
                            url: `http://localhost:3000/todos/${todo.id}`,
                            data: {
                                status: todo.status,
                                id: todo.id
                            },
                            headers: {
                                token: localStorage.getItem('token')
                            }
                        })
                        .done(updated => {
                            if (todo.status) {
                                deleteTodo(todo.id)
                            }
                            // getTodo()
                            formnotifsuccess(`${updated.message}`)
                        })
                        .fail(err => {
                            console.log(err)
                        })
                })
            });
        })
        .fail(err => {
            console.log(err)
        })
}