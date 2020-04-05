const baseUrl = 'https://fancytodohacktiv8.herokuapp.com/';

$(document).ready(() => {
    auth()
})

function auth() {
    if(localStorage.token) {
        $('#dashboard-page').show();
        $('#login-page').hide();
        $('#register-page').hide();
        $('#show-todo-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
        $('#title-page').hide();
        $('#table-movie').hide();
        showTodos()
    } else {
        $('#dashboard-page').hide();
        $('#login-page').show();
        $('#register-page').hide();
        $('#show-todo-page').hide();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
        $('#title-page').show();
        $('#table-movie').hide();
    }
}

// <!-- BUTTON-REDIRECT ======================================================================== -->

$('#btn-register').on('click', () => {
    $('#dashboard-page').hide();
    $('#login-page').hide();
    $('#register-page').show();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
    $('#title-page').hide();
    $('#table-movie').hide();
})
    
$('#btn-login').on('click', () => {
    $('#dashboard-page').hide();
    $('#login-page').show();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
    $('#title-page').hide();
    $('#table-movie').hide();
})
    
$('#btn-logout').on('click', () => {
    logout();
    localStorage.clear();
    auth();
})

$('#create_button').on('click', () => {
    $('#dashboard-page').show();
    $('#login-page').hide();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').show();
    $('#update-todo-page').hide();
    $('#title-page').hide();
    $('#table-movie').hide();
})

$('#btn-back').on('click', () => {
    auth()
})

$('#btn-back-2').on('click', () => {
    auth()
})

$('#btn-back-3').on('click', () => {
    auth()
})
// <!-- AJAX ======================================================================== -->

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
            showTodos()
            auth()
        })
        .fail(err => {
            $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
            $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
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
            localStorage.setItem('token', data.token);
            auth();
        })
        .fail(err => {
            $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showRegister()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
        })
}

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: baseUrl + '/googleSignIn',
        headers: {
            token: id_token
        }
    })
        .done(token => {
            localStorage.setItem('token', token);
            console.log('sign in success', token);
            auth()
        })
        .fail(err => {
            $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
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

function showTodos() {
    $.ajax({
        method: "GET",
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (todos) {
            console.log(todos)
            $(".main").empty();
            if(todos.length == 0) {
                $(".main").append(`
                    <div id="no-todo">
                        <h2>You have no todo</h2>
                        <i class="fa fa-hand-o-up"></i>
                    </div>`
                )
            }

            for (let i = 0; i < todos.length; i++){
                let formattedDate = new Date(todos[i].due_date).toISOString().substring(0, 10);
                let year = formattedDate.substring(0, 4);
                let month = formattedDate.substring(5, 7);
                let date = formattedDate.substring(8, 10);
                month = monthConverter(month);
                let fixedDate = `${date} ${month} ${year}`
                if(!status.length == 0){
                    $('.main').append(`
                    <div class="show-main-todo">
                    <h3>Let's create todo</h3>
                    <table class="table table-bordered table-hover table-info bg-light">
                        <thead thead-dark>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                        </tbody>
                    </table>
                    </div>`)
                } else {
                    if(todos[i].status) {
                        $('.main').append(`
                        <div class="show-main-todo">
                        <table class="table table-bordered table-hover table-info bg-light">
                            <thead thead-dark>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <td>${todos[i].title}</td>
                                    <td>${todos[i].description}</td>
                                    <td>${fixedDate}</td>
                                    <td><i onclick="markTodo(${todos[i].id})" class="fas fa-calendar-check fa-2x"></i></td>
                                    <td><i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i> <i onclick="editTodo(${todos[i].id})" class="fas fa-edit fa-2x"></i></td>
                            </tbody>
                        </table>
                        </div>`)
                    } else {
                        $('.main').append(`
                        <div class="show-main-todo">
                        <table class="table table-bordered table-hover table-info bg-light">
                            <thead thead-dark>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <td>${todos[i].title}</td>
                                    <td>${todos[i].description}</td>
                                    <td>${fixedDate}</td>
                                    <td><i onclick="markTodo(${todos[i].id})" class="fas fa-calendar fa-2x"></i></td>
                                    <td><i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i> <i onclick="editTodo(${todos[i].id})" class="fas fa-edit fa-2x"></i></td>
                            </tbody>
                        </table>
                        </div>`)
                        }
                    }
                }
            })
                .fail(function (err) {
                    $('#errorMsg').empty()
                    $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                        $("#errorMsg").slideUp(500);
                    });
                    if(err.responseJSON.errors){
                        $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
                    } else {
                        $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
                    }
                    showError()
                })
}

function createTodos(event) {
    event.preventDefault();
    console.log(localStorage.getItem('token'))
    $.ajax({
        method: "POST",
        url: baseUrl + '/todos',
        headers: {
            token : localStorage.getItem('token')
        },
        data: {
            title: $("#title").val(),
            description: $("#description").val(),
            status: false,
            due_date: $("#due_date").val()
        }
    })
        .done((result) => {
            auth()
            showTodos()
        })
        .fail(err => {
            $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
        })
}


function markTodo(id) {
    $.ajax({
        method: 'GET',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(todoFound => {
        if(!todoFound.status) {
            $.ajax({
                method: 'PATCH',
                url: baseUrl + `/todos/done/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(markedTodo => {
                    markTodo.status = true;
                    auth()
                    console.log(markedTodo.status);
                    console.log(markedTodo.id);
                })
                .fail(err => {
                    $('#errorMsg').empty()
                    $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                        $("#errorMsg").slideUp(500);
                    });
                    $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
                        showError()
                    })
        } else {
            $.ajax({
                method: 'PATCH',
                url: baseUrl + `/todos/undone/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(markedTodo => {
                    markTodo.status = false;
                    auth()
                    console.log(markedTodo.status);
                    console.log(markedTodo.id);
                })
                .fail(err => {
                    $('#errorMsg').empty()
                    $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                        $("#errorMsg").slideUp(500);
                    });
                    $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
                        showError()
                    })
        }
    })
    .fail(err => {
        $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
    })
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(todo => {
            console.log('Successfully deleted a todo');
            auth()
        })
        .fail(err => {
            $('#errorMsg').empty()
            $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
                $("#errorMsg").slideUp(500);
            });
            $('#errorMsg').append(`<a onclick="showLogin()" id="create_todo_button" class="alert alert-danger">${err.responseJSON.errors.message}!</a>`)
            showError()
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
    $('#dashboard-page').show();
    $('#login-page').hide();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').show();
    $('#title-page').hide();
    $('#table-movie').hide();
    $.ajax({
        method: 'GET',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(founded => {
            let dateFormat = new Date(founded.due_date).toISOString().substring(0, 10);
            $('#title-update').val(founded.title);
            $('#description-update').val(founded.description);
            $('#due_date-update').val(dateFormat);
            localStorage.setItem('todoId', id);
        })
        .fail(err => {
            console.log(err);
        })
}


// <!-- SHOW-PAGE ======================================================================== -->

function showDashboard() {
    showTodos();
    auth();
}

function showLogin() {
    $('#dashboard-page').hide();
    $('#login-page').show();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
    $('#title-page').show();
    $('#table-movie').hide();
}

function showRegister() {
    $('#dashboard-page').hide();
    $('#login-page').hide();
    $('#register-page').show();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
    $('#title-page').show();
    $('#table-movie').hide();
}

function showEdit() {
    $('#dashboard-page').show();
    $('#login-page').hide();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').show();
    $('#title-page').show();
    $('#table-movie').hide();
}

function postUpdateTodo(event) {
    event.preventDefault();
    const title = $('#title-update').val();
    const description = $('#description-update').val();
    const due_date = $('#due_date-update').val();

    console.log(title)
    
    console.log(localStorage.getItem('todoId'))
    $.ajax({
        method: 'PUT',
        url: baseUrl + `/todos/${localStorage.getItem('todoId')}`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            console.log(response)
            auth()
        })
        .fail(err => {
            console.log('Error!', err);
        })
}

function loading() {
    $('body').append(`
        <img src="https://media1.tenor.com/images/db85ba00c6073b451a8f05156a66524e/tenor.gif?itemid=9856796></img>
    `)
}


function showCorona(el) {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/api/corona',
    })
        .done((res) => {
            $('#corona').empty()
            $('#corona').append(`
                <tr>
                    <td>${res.cases}</td>
                    <td>${res.deaths}</td>
                    <td>${res.recovered}</td>
                    <td>${res.updated}</td>
                    <td>${res.active}</td>
                    <td>${res.affectedCountries}</td>
                </tr>
            `)
        })
        .fail(err => {
            console.log(err)
        })
}

$('#btn-corona').on('click', () => {
    $('#dashboard-page').show();
    $('#login-page').hide();
    $('#register-page').hide();
    $('#show-todo-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
    $('#title-page').hide();
    $('#table-movie').show();
    showCorona()
})

jQuery(function ($) {
    $(".sidebar-dropdown > a").click(function() {
    $(".sidebar-submenu").slideUp(200);
    if (
    $(this)
        .parent()
        .hasClass("active")
    ) {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
        .parent()
        .removeClass("active");
    } else {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
        .next(".sidebar-submenu")
        .slideDown(200);
    $(this)
        .parent()
        .addClass("active");
    }
    });
    
    $("#close-sidebar").click(function() {
    $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
    $(".page-wrapper").addClass("toggled");
    });
    
    });