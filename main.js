let baseUrl = 'http://localhost:3000'

$(document).ready(function() {
    console.log(`masuk ke doc ready`)
    auth()
        // $('.logout').click(function () {
        //     localStorage.clear()
        //     auth()
        // })
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
        hideElement('#login-form-container')
        hideElement('#signup-form-container')
        getTodo()
    } else {
        console.log(`masuk ke auth not get token yet`)
        showElement('#signup-form-container')
        hideElement('#login-form-container')
        hideShowElement('#signup-form-btn', '#login-form-container', '#signup-form-container')
        hideShowElement('#signin-form-btn', '#signup-form-container', '#login-form-container')
        $(`#signup-btn`).click((e) => {
                e.preventDefault()
                console.log(`masuk register`)
                let email = $(`#email-signup`).val()
                let password = $(`#password-signup`).val()
                console.log(email, password)
                    // $(`#signup-form .auth-notifications`).empty()

                if ($(`#email-signup`).val() === '' || $(`#password-signup`).val() === '') {
                    return authnotifications('Ooops!! all fields are required!')
                }

                $('#signup-btn').addClass('loading')
                $.ajax({
                        method: 'post',
                        url: baseUrl + '/users/register',
                        // url: `http://localhost:3000/users/register`,
                        data: {
                            email,
                            password
                        }
                    })
                    .done(user => {
                        console.log(">>>>>>", user)
                        localStorage.setItem('token', user.token)
                        $(`#signup-form .auth-notifications`).append(`
                    <div class="ui success message">
                    <p>${user.email} successfully registered!</p>
                    </div>
                    `)
                            // $(`#name-signup`).val('')
                            // $(`#email-signup`).val('')
                            // $(`#password-signup`).val('')
                        auth()
                    })
                    .fail(err => {
                        console.log(err)
                        $(`#signup-form .auth-notifications`).append(`
                    <p>${err.responseJSON.err}</p>
                `)
                    })
            })
            //================

        //LOGIN 
        $(`#signin-btn`).click(e => {
            e.preventDefault()
            console.log('masuk login')
                // $(`#login-form .auth-notifications`).empty()
            if ($(`#email-login`).val() === '' || $(`#password-login`).val() === '') {
                return loginnotif('Ooops!! all fields are required!')
            }
            $('#signup-btn').addClass('loading')

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
                    console.log(user.token)
                        // $(`#password-login`).val('')
                        // $(`#email-login`).val('')
                        // auth()
                        // getTodo()
                    console.log('hide element etc')
                    hideElement(`#signup-form-container`)
                    hideElement(`#login-form-container`)
                    showElement('#signout-btn')
                    showElement(`#wrap-main`)
                        // getUser()
                    console.log('google sblm get todo')
                    getTodo()
                    showElement(`#todo`)
                    showElement(`#form-todo`)

                })
                .fail(err => {
                    loginnotif(err.responseJSON.err)
                })
                .always(_ => {
                    $('#signup-btn').removeClass('loading')
                })
        })
    }
}


// REGISTER


// function getTodo() {
//     $.ajax({
//             method: 'GET',
//             url: `http://localhost:3000/todos`,
//             headers: {
//                 token: localStorage.token
//             }
//         })
//         .done(data => {
//             console.log(data)
//         })
//         .fail(err => {
//             console.log(err, 'error')
//         })
// }

function authnotifications(msg) {
    $(`#signup-form .auth-notifications`).append(`
        <div class="ui error message error-sans">
        <p>${msg}</p>
        </div>`)
}

function loginnotif(msg) {
    $(`#login-form .auth-notifications`).append(`
    <div class="ui error message error-sans">
    <p>${msg}</p>
    </div>`)
}

//create tdo
// $(`#todo-form`).on('submit', (e) => {
//     e.preventDefault()
//     if ($(`#title`).val() === '' || $(`#description`).val() === '' || $(`#due-date`).val() === '') {
//         console.log('masuk')
//         return formnotif(`Oops!! all fields are required`)
//     }

//     $.ajax({
//             method: 'post',
//             url: `http://localhost:3000/todos/create`,
//             data: {
//                 title: $(`#title`).val(),
//                 description: $(`#description`).val(),
//                 due_date: $(`#due-date`).val()
//             },
//             headers: {
//                 token: localStorage.getItem('token')
//             }
//         })
//         .done(_ => {
//             formmotifsuccess(`successesfully add to do list`)
//             getTodo()
//         })
//         .fail(err => {
//             console.log(err)
//         })
//         .always(_ => {
//             $(`#title`).val('')
//             $(`#description`).val('')
//             $(`#due-date`).val('')
//             $(`#form-notifications`).val('')
//         })

// })





// function getMoment(date) {
//     // moment().format();
//     var seconds = Math.floor((new Date() - new Date(date)) / 1000);

//     var interval = Math.floor(seconds / 31536000);

//     if (interval > 1) {
//         return interval + " years ago";
//     }
//     interval = Math.floor(seconds / 2592000);
//     if (interval > 1) {
//         return interval + " months ago";
//     }
//     interval = Math.floor(seconds / 86400);
//     if (interval > 1) {
//         return interval + " days ago";
//     }
//     interval = Math.floor(seconds / 3600);
//     if (interval > 1) {
//         return interval + " hours ago";
//     }
//     interval = Math.floor(seconds / 60);
//     if (interval > 1) {
//         return interval + " minutes ago";
//     }
//     return "a few seconds ago";
// }

// function getWeather() {
//     $.ajax({
//             method: 'get',
//             url: `https://api.weatherbit.io/v2.0/current?lat=-6.260698&lon=106.781492&key=b8083e7c11894146b71be354946eddd8`
//         })
//         .done(weather => {
//             console.log(weather.data[0])
//             let data = weather.data[0]
//             $(`#weather`).html(`


//         <img src="https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png" alt="">
//         <div id=weather-content>
//             <h4>${data.weather.description}</h4>
//             <p>${data.city_name} ${data.country_code}<p>
//             <p>${data.timezone}</p>
//             <p>temperature : ${data.temp}°C</p>
//         </div>
//         `)
//         })
//         .fail(err => {
//             console.log(err)
//         })
// }

// function getdate(inputDate) {
//     const monthNames = ["", "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];
//     let year = new Date(inputDate).getFullYear()
//     let month = new Date(inputDate).getMonth()
//     let date = new Date(inputDate).getDate()
//     return `${date}-${monthNames[month]}-${year}`
// }

// function formnotif(msg) {
//     console.log(msg)
//     $(`#form-notifications`).html(`
//         <div class="ui error message error-sans">
//         <p>${msg}</p>
//         </div>`)
// }

// function formmotifsuccess(msg) {
//     $(`#form-notifications`).html(`
//         <div class="ui success message">
//         <p>${msg}</p>
//         </div>`)
// }

// function deleteSuccess(msg) {
//     $(`#deltesuccessnotif`).html(`
//         <div class="ui success message">
//         <p>${msg}</p>
//         </div>`)
// }

// function deletefail(msg) {
//     $(`#deltesuccessnotif`).html(`
//         <div class="ui error message">
//         <p>${msg}</p>
//         </div>`)
// }

// function getUser() {
//     console.log('masuk get user')
//     $.ajax({
//             method: 'get',
//             url: `http://localhost:3000/users`,
//             headers: {
//                 token: localStorage.getItem('token')
//             }
//         })
//         .done(user => {
//             $(`#user-profile`).html(
//                 `<div id="user-container">
//                 <div id="profile">
//                 <h2>Welcome ${user.name}</h2>
//                 <p id="signout-btn" onclick="signOut()">
//                 enough for today? sign out!
//                 </p>
//                 </div>
//                 <div id="weather"></div>
//                 `
//             )
//             getWeather()
//         })
//         .fail(err => {
//             console.log(err)
//         })
// }

// function deleteTodo(id) {
//     $.ajax({
//             method: 'delete',
//             url: `http://localhost:3000/todos/${id}`,
//             headers: {
//                 token: localStorage.getItem('token')
//             }
//         })
//         .done(({ response, msg }) => {
//             deleteSuccess(msg)
//             getTodo()
//         })
//         .fail(err => {
//             deletefail(err.msg)
//         })
// }
// //get todo => include = delete todo , update status todod
// function getTodo() {
//     console.log('masuk get todo')
//     $.ajax({
//             method: 'get',
//             url: `http://localhost:3000/todos`,
//             headers: {
//                 token: localStorage.getItem('token')
//             }
//         })
//         .done(result => {
//             console.log(`initodos`, result)
//             $(`#todo`).empty()
//             let todos = result.Todos
//             console.log(todos)
//             todos.forEach(todo => {
//                 console.log(getMoment(todo.createdAt))
//                 $(`#todo`).append(`
//             <div class="item">
//                 <i class="large github middle aligned icon ${(todo.status) ? "green" : "grey" }"></i>
//                 <div class="content">      
//                 <div class='head-todo'>
//                     <p class="header">${todo.title}</p>
//                     <p class="date">${getMoment(todo.createdAt)}</p>
//                 </div>         
//                     <div class="description">${todo.description}</div>
//                     <div class="todo-link">
//                         <a><span id="${todo.id}" style="color:#008080;  font-size:12px;">${!todo.status ? "undone":"done"}</span></a>
//                         <a><span id="${todo.id}delete" style="color:#A0A0A0;" onclick="deleteTodo('${todo.id}')" class="delete-todo">delete</span></a>
//                     </div>
//                 </div>
//             </div>
//             `)

//                 //HOVER EFFECT
//                 $(`#${todo.id}`).hover(() => {
//                     if (!todo.status) $(`#${todo.id}`).html("done")
//                     else $(`#${todo.id}`).html("undone")
//                 }, () => {
//                     if (!todo.status) $(`#${todo.id}`).html("undone")
//                     else $(`#${todo.id}`).html("done")
//                 })

//                 //CHANGE STATUS AJAX
//                 $(`#${todo.id}`).on('click', () => {
//                     !todo.status ? todo.status = true : todo.status = false
//                     $.ajax({
//                             method: 'patch',
//                             url: `http://localhost:3000/todos/${id}`,
//                             data: {
//                                 status: todo.status,
//                                 id: todo.id
//                             },
//                             headers: {
//                                 token: localStorage.getItem('token')
//                             }
//                         })
//                         .done(updated => {
//                             getTodo()
//                         })
//                         .fail(err => {
//                             console.log(err)
//                         })
//                 })
//             });
//         })
//         .fail(err => {
//             console.log(err)
//         })
// }