const baseUrl = 'http://localhost:3000';

$(document).ready(() => {
    auth()
})

function auth() {
    if(localStorage.token) {
        $('.dashboard-page').show();
        $('.login-page').hide();
        $('.register-page').hide();
        $('.create-todo-page').hide();
        $('.update-todo-page').hide();
    } else {
        $('.login-page').show();
        $('.dashboard-page').hide();
        $('.register-page').hide();
        $('.create-todo-page').hide();
        $('.update-todo-page').hide();
    }
}

function login(event) {
    event.preventDefault();
    const email = $('#email-login-value').val();
    const password = $('#password-login-value').val();
    $.ajax({
        method: 'POST',
        url: baseUrl + '/login',
        data: {
            email,
            password
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err.responseJSON.errors);
        })
}

function register(event) {
    event.preventDefault();
    const email = $('#email-register-value').val();
    const password = $('#password-register-value').val();
    $.ajax({
        method: 'POST',
        url: baseUrl + '/register',
        data : {
            email,
            password
        }
    }) 
        .done(data => {
            console.log(data)
        })
        .fail(err => {
            console.log(err.responseJSON.errors);
        })
}


function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/googleSignIn',
        headers: {
            token: id_token
        }
    })
        .done(token => {
            localStorage.setItem('token', token);
            console.log('sign in success', token);
            fetchTodos();
            auth()
        })
        .fail(err => {
            console.log('sign in failed', err);
        })

    console.log(id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function logout() {
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

function fetchTodos(event) {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(todos => {
            $('.todos').empty();
            if(todos.length == 0) {
                $('.todos').append(`
                <div id="no-todo">
                    <h2>You have no todo</h2>
                    <button onclick="showAddForm()" id="create-from-scratch">Create One</button>
                </div>
                `)
            } else {
                for (let i = 0; i < todos.length; i++) {
                    let formattedDate = new Date(todos[i].due_date).toISOString().substring(0, 10);
                    let year = formattedDate.substring(0, 4);
                    let month = formattedDate.substring(5, 7);
                    let date = formattedDate.substring(8, 10)
                    month = monthConverter(month);
                    let fixedFormattedDate = `${date} ${month} ${year}`
                    
                    if(!todos[i].status) {
                        $('.todos').append(`
                            <div class="todo">
                            <div id="checkbox${todos[i].id}">
                                <i onclick="markTodo(${todos[i].id})" class="fas fa-circle fa-2x"></i>
                            </div>
                            <div onclick="editTodo(${todos[i].id})" class="theTodo">
                                <div id="titleAndDesc">
                                    <h4>${todos[i].title}</h4>
                                    <p>${todos[i].description}</p>
                                </div>
                                <h4>${fixedFormattedDate}</h4>
                            </div>
                            <div class="delete">
                                <i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i>
                            </div>
                        </div>
                        `)
                    } else {
                        $('.todos').append(`
                        <div class="todo">
                            <div id="checkbox${todos[i].id}">
                                <i onclick="markTodo(${todos[i].id})" class="fas fa-check-circle fa-2x"></i>
                            </div>
                            <div onclick="editTodo(${todos[i].id})" class="theTodo">
                                <div id="titleAndDesc">
                                    <h4>${todos[i].title}</h4>
                                    <p>${todos[i].description}</p>
                                </div>
                                <h4>${fixedFormattedDate}</h4>
                            </div>
                            <div class="delete">
                                <i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i>
                            </div>
                        </div>`)
                    }
                }
            }
        })
        .fail(err => {
            console.log(err)
        })
}

function monthConverter(month) {
    switch (month) {
        case '01': 
            month = 'Jan';
            break;
        case '02': 
            month = 'Feb';
            break;
        case '03': 
            month = 'Mar';
            break;
        case '04': 
            month = 'Apr';
            break;
        case '05': 
            month = 'May';
            break;
        case '06': 
            month = 'Jun';
            break;
        case '07': 
            month = 'Jul';
            break;
        case '08': 
            month = 'Aug';
            break;
        case '09': 
            month = 'Sep';
            break;
        case '10': 
            month = 'Oct';
            break;
        case '11': 
            month = 'Nov';
            break;
        case '12': 
            month = 'Dec';
            break;
    }
    return month;
}

function editTodo(id) {
    $('.dashboard-page').hide();
    $('.login-page').hide();
    $('.register-page').hide();
    $('.create-todo-page').hide();
    $('.update-todo-page').show();
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos/'+ id,
        headers: localStorage.getItem("token")
    })
        .done(founded => {
            let dateFormat = new Date(founded.due_date).toISOString().substring(0, 10);
            $('#update-title').val(founded.title);
            $('#update-description').val(founded.description);
            $('#update-due_date').val(dateFormat);
            localStorage.setItem('todoId', id);
        })
        .fail(err => {
            console.log(err);
        })
}

function markTodo(id) {

}

function createTodos(event) {
    event.preventDefault();
    const title = $('#title').val();
    const description = $('#description').val();
    const due_date = $('due_date').val();
    $.ajax({
        method: 'POST',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.getToken
        },
        data: {
            title,
            description,
            status: false,
            due_date
        }
            .done(_ => {
                auth();
                // $('').hide();
                fetchTodos()
            })
            .fail(err => {
                console.log(err);
            })
    })
}

function showDashboard() {
    fetchTodos();
    $('.dashboard-page').show();
    $('.login-page').hide();
    $('.register-page').hide();
    $('.create-todo-page').hide();
    $('.update-todo-page').hide();
}

function showAddForm() {
    $('.dashboard-page').hide();
    $('.login-page').hide();
    $('.register-page').hide();
    $('.create-todo-page').show();
    $('.update-todo-page').hide();
}

$('#btn-register').on('click', () => {
    $('.dashboard-page').hide();
    $('.login-page').hide();
    $('.register-page').show();
    $('.create-todo-page').hide();
    $('.update-todo-page').hide();
})

$('#btn-login').on('click', () => {
    $('.dashboard-page').hide();
    $('.login-page').show();
    $('.register-page').hide();
    $('.create-todo-page').hide();
    $('.update-todo-page').hide();
})

$('#btn-logout').on('click', () => {
    logout();
    localStorage.clear();
    $('.dashboard-page').hide();
    $('.login-page').show();
    $('.register-page').hide();
    $('.create-todo-page').hide();
    $('.update-todo-page').hide();
})