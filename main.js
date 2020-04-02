// for localhost
// let baseUrl = "http://localhost:3000"

//for heroku
let baseUrl = "https://fancytodo-server.herokuapp.com/"

$(document).ready( () => {
    auth()
    $('.logout').click( () => {
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    auth()
    })
})

function login(event) {
    event.preventDefault()
    let email = $('#email').val()
    let password = $('#password').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/login',
        data: { email, password }
    })
        .done(data => {
            localStorage.setItem('token', data.accessToken)
            auth()
        })
        .fail(err => {
            console.log(err.responseJSON, 'error')
        })
}

function auth() {
    if (localStorage.token) {
        $('.loginPage').hide()
        $('.mainPage').show()
        $('.updatePage').hide()
        $('.holidayPage').hide()
        fetchTodos()
    } else {
        $('.loginPage').show()
        $('.mainPage').hide()
        $('.updatePage').hide()
        $('.holidayPage').hide()
    }
}

function fetchTodos() {
    $('.todoList').empty()
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            accessToken: localStorage.token
        }
    })
        .done(data => {
            
            for(let i = 0; i < data.todos.length; i++) {
                let title = data.todos[i].title
                let description = data.todos[i].description
                let status = data.todos[i].status
                let due_date = data.todos[i].due_date
                let id = data.todos[i].id

                $('.todoList').append(`
                            <tr>
                                <td>${title}</td>
                                <td>${description}</td>
                                <td>${status}</td>
                                <td>${(due_date.slice(0,10))}</td>
                                <td>
                                    <button onclick = "updateBtn(${id})">Edit</button>
                                    <button onclick = "deleteBtn(${id})">Delete</button>
                                </td>
                            </tr>
                `)
            }

        })
        .fail(err => console.log(err, 'error'))
}

function createTodo(event) {
    event.preventDefault()

    let data = {
        title: $('#title').val(),
        description: $('#description').val(),
        status: false,
        due_date: $('#due_date').val()
    }

    $.ajax({
        method: 'POST',
        url: baseUrl + '/todos',
        headers: {
            accessToken: localStorage.token
        },
        data
    })
        .done(result => {
            auth()
            $('#modal-1').trigger('click')
        })
        .fail(err => {
            console.log(err, 'error')
        })
}

function updateBtn(id) {
$('.updatePage').show()
$('.mainPage').hide()

$.ajax({
    method: 'GET',
    url: baseUrl + '/todos/' + id,
    headers: {
        accessToken: localStorage.token
    }
})
    .done(data => {
        $('#newTitle').val(data.result.title)
        $('#newDescription').val(data.result.description)
        if (data.result.status == false) {
            $('.newStatus').val(['false'])
        } else {
            $('.newStatus').val(['true'])
        }
        $('#newDue_date').val(data.result.due_date.slice(0,10))
        localStorage.setItem('id', id)
    })
    .fail(err => {
        console.log(err, 'error')
    })
}


    function updateTodo(event) {
        event.preventDefault()
        let data = {
            title: $('#newTitle').val(),
            description: $('#newDescription').val(),
            status: $('.newStatus:checked').val(),
            due_date: $('#newDue_date').val()
        }

        let id = localStorage.id

        $.ajax({
            method: 'PUT',
            url: baseUrl + '/todos/' + id,
            headers: {
                accessToken: localStorage.token
            },
            data
        })
            .done(result => {
                localStorage.removeItem('id')
                auth()
            })
            .fail(err => {
                console.log(err, 'error')
            })
    }

    function deleteBtn(id) {
        $.ajax({
            method: 'DELETE',
            url: baseUrl + '/todos/' + id,
            headers: {
                accessToken: localStorage.token
            }
        })
            .done(result => {
                auth()
            })
            .fail(err => {
                console.log(err, 'error')
            })
    }

    function onSignIn(googleUser) {
        var id_token = googleUser.getAuthResponse().id_token;
        console.log('satu kali')
        $.ajax({
            method: 'POST',
            url: baseUrl + '/users/googleSign',
            data: {
                id_token
            }
        })
            .done(data => {
                localStorage.setItem('token', data.accessToken)
                auth()
            })
            .fail(err => {
                console.log(err.responseJSON, 'error')
            })
    }
      
    function showHoliday(event) {
        event.preventDefault()
        $('.holidayList').empty()
        $('.holidayPage').show()
        $('.mainPage').hide()
        let year = $('#year').val()
        $('#modal-2').trigger('click')


        $.ajax({
            method: 'GET',
            url: baseUrl + '/api/calendarificID/' + year
        })
            .done( result => {
                console.log(result.data.response.holidays)

                for(let i = 0; i < result.data.response.holidays.length; i++) {
                    let name = result.data.response.holidays[i].name
                    let description = result.data.response.holidays[i].description
                    let date = result.data.response.holidays[i].date.iso

                    $('.holidayList').append(`
                        <tr>
                            <td>${i+1}</td>
                            <td>${name}</td>
                            <td>${description}</td>
                            <td>${date}</td>
                        </tr>
                    `)
                }
            })
            .fail( err => {
                console.log(err, 'error')
            })
    }
