let baseUrl = 'http://localhost:3000'

$(document).ready(() => {

    auth()

})

function loginPage() {
    $('#register-page').hide()
    $('#login-page').show()
}

function registerPage() {
    $('#login-page').hide()
    $('#register-page').show()
}

function TodoAddPage() {
    $('#navbar').show()
    $('#todo-content').hide()
    $('#todo-add').show()
    $('#todo-edit').hide()
}

function TodoEditPage() {
    $('#todo-content').hide()
    $('#todo-add').hide()
    $('#todo-edit').show()
}

function homepage() {
    $('#navbar').show()
    $('#container').show()
    $('#todo-content').show()
    $('#todo-add').hide()
    $('#todo-edit').hide()
    getTodo()
    showPrayTime()
    $('#register-page').hide()
    $('#login-page').hide()
    $('#todo-add').hide()
    $('#todo-edit').hide()
}

function login(event) {
    event.preventDefault()
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    $.ajax({
            method: 'POST',
            url: baseUrl + '/users/login',
            data: {
                email,
                password
            }
        })
        .done(data => {
            localStorage.setItem('userId', data.id)
            localStorage.setItem('access_token', data.access_token)
            auth()
            console.log(data)
        })
        .fail(err => {
            err.responseJSON.errors.forEach(data => {
                console.log(data.message)
            })
            auth()
        })
}

function register(event) {
    event.preventDefault()
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    $.ajax({
            method: 'POST',
            url: baseUrl + '/users/register',
            data: {
                email,
                password
            }
        })
        .done(data => {
            localStorage.setItem('userId', data.id)
            localStorage.setItem('access_token', data.access_token)
            auth()
            console.log(data)
        })
        .fail(err => {
            err.responseJSON.errors.forEach(data => {
                console.log(data.message)
            })
            auth()
        })
}

function auth() {

    if (localStorage.access_token) {
        homepage()
    } else {
        loginPage()
        $('#navbar').hide()
        $('#container').hide()
    }
}

function logout(event) {
    localStorage.clear()
    auth()
}

function getTodo() {
    // $('.todolist').empty()
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.access_token
        }
    })

    .done((result => {
            let userId = localStorage.getItem('userId')
            for (let i = 0; i < result.alldata.length; i++) {
                if (result.alldata[i].UserId == userId) {
                    let day = new Date(result.alldata[i].due_date).getDate()
                    let month = new Date(result.alldata[i].due_date).getMonth()
                    let year = new Date(result.alldata[i].due_date).getFullYear()
                    let due_date = `${day}-${month}-${year}`
                    $('.todolist').append(`
                
                    <tr>
                    <td>${result.alldata[i].title}</td>
                    <td>${result.alldata[i].description}</td>
                    <td>${result.alldata[i].status}</td>
                    <td>${due_date}</td>
                    <td><a href="#" onclick="editBtn(result.alldata[i].id)">Edit</a> <a href="#" onclick="">Delete</a></td>
                    </tr>
                
                 `)
                }
            }
        }))
        .fail(err => {

        })
}

function createTodo(event) {
    event.preventDefault();
    let UserId = localStorage.getItem('userId')
    let title = $('#titleAdd').val()
    let description = $('#descriptionAdd').val()
    let due_date = $('#due_dateAdd').val()
    let status = 'Undone'
    createdAt = new Date()
    updatedAt = new Date()
    $.ajax({
            method: 'POST',
            url: baseUrl + '/todos',
            headers: {
                access_token: localStorage.access_token
            },
            data: {
                title,
                description,
                status,
                due_date,
                UserId
            }
        })
        .done(() => {
            homepage()
            $(`#todomessage`).append('Add Success')
            $(`#todomessage`).empty()
        })
        .fail(err => {
            console.log(err)
        })
}

function editBtn(id) {
    // console.log(id)
    $('.updatePage').show()
    $('.mainPage').hide()
    $.ajax({
            method: 'GET',
            url: baseUrl + '/todos/' + id,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(data => {
            $('#idUpdate').val() = id
            $('#titleUpdate').val() = result.alldata[0].title
            $('#descriptionUpdate').val()
            $('#statusUpdate').val()
            $('#due_dateUpdate').val()
        })
        .fail(err => {
            console.log(err, 'error')
        })
}

function editTodo(event) {
    event.preventDefault()
    let id = $('#idUpdate').val()
    let title = $('#titleUpdate').val()
    let description = $('#descriptionUpdate').val()
    let status = $('#statusUpdate').val()
    let due_date = $('#due_dateUpdate').val()
    $.ajax({
            method: 'PUT',
            url: baseUrl + '/todos/' + id,
            headers: {
                access_token: localStorage.access_token
            },
            data: {
                title,
                description,
                status,
                due_date
            }
        })
        .done(() => {
            authentication()
                // $('.mainPage').show()
            $('.updatePage').hide()
        })
        .fail(err => {
            console.log(err)
        })
}


function showPrayTime() {
    $.ajax({
            method: 'GET',
            url: `${baseUrl}/api/jakarta`,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(result => {

            $('#location').empty()
            $('#date').empty()
            $('#fajr').empty()
            $('#dhuhr').empty()
            $('#asr').empty()
            $('#maghrib').empty()
            $('#isha').empty()
            $('#location').append(`Location : ${result.data.query}`)
            $('#date').append(`Date : ${result.data.items[0].date_for}`)
            $('#fajr').append(`Fajr : ${result.data.items[0].fajr}`)
            $('#dhuhr').append(`Dhuhr : ${result.data.items[0].dhuhr}`)
            $('#asr').append(`Asr : ${result.data.items[0].asr}`)
            $('#maghrib').append(`Maghrib : ${result.data.items[0].maghrib}`)
            $('#isha').append(`Isya : ${result.data.items[0].isha}`)
        })
        .fail(err => {

        })
}