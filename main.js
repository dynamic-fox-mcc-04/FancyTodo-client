let baseUrl = 'http://localhost:3000'

$(document).ready(function () {
    auth()
    $('.logout').click(function () {
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        auth()
    })
})



function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: baseUrl + '/googleSign',
        data: {
            id_token
        }
    }).done(datum => {
        localStorage.setItem('access_token', datum.access_token)
        localStorage.setItem('email', datum.email)
        auth()

    }).fail(err => {
        // console.log(err);
        alertHandler(err.responseJSON.type)
        // logout()
    })
}


function auth() {
    if (localStorage.access_token) {
        $('#loginTodo').hide()
        $('.updatePage').hide()
        $('#main_page').show()
        fetchData()
    } else {
        $('#loginTodo').show()
        $('#main_page').hide()
        $('.updatePage').hide()
    }
}

function login(event) {
    event.preventDefault();

    let email = $("#email").val()
    let password = $("#password").val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/login',
        data: {
            email,
            password
        }
    }).done(datum => {
        localStorage.setItem('access_token', datum.access_token)
        localStorage.setItem('email', datum.email)
        auth()
    }).fail(err => {
        alertHandler(err.responseJSON.msg)
    })
}



function fetchData() {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.access_token
        }

    }).done(data => {

        const { todo } = data
        // console.log(data)
        $(".showEmail").empty()
        $(".todo_list tbody").empty()
        for (let i = 0; i < todo.length; i++) {
            let todoEl = todo[i]
            productsAdd(todoEl)
        }
        showEmail(localStorage.email)
    }).fail(err => {
        console.log(err);
        
        alertHandler(err.responseJSON.type)
    })
}

function productsAdd(todoEl) {
    $(".todo_list tbody").append(
        "<tr>" +
        `<td><button onclick=deleteTodo(${todoEl.id})>Delete</button> | <button onclick="updateBtn(${todoEl.id})">Edit</button></td>` +
        `<td>${todoEl.id}</td>` +
        `<td>${todoEl.title}</td>` +
        `<td>${todoEl.description}</td>` +
        `<td>${todoEl.status}</td>` +
        `<td>${new Date(todoEl.due_date).toDateString()}</td>` +
        // `<td><button type="submit" onsubmit=${deleteTodo(todoEl.id)}>Delete</button>
        // <button href="#"><button>Update</button></button>` +
        +
        "</tr>"
    );
}


function showEmail(email) {
    $(".showEmail").append(
        `<p>User: ${email}</p>`
    )
}

function alertHandler(msg) {
    $(".alert").find('.message').text(msg);
    $(".alert").fadeIn("slow", function () {
        setTimeout(function () {
            $(".alert").fadeOut("slow");
        }, 2500);
    });
}a

function deleteTodo(id) {
    event.preventDefault()
    $.ajax({
        method: 'DELETE',
        url: `${baseUrl}/todos/${id}`,
        headers: {
            access_token: localStorage.access_token
        }
    }).done(success => {
        // console.log(success)
        auth()
        alertHandler(success.message)

    }).fail(err => {
        alertHandler(err.responseJSON)
    })
}a

function addTodo(event) {
    event.preventDefault()
    let title = $('#title').val()
    let description = $('#description').val()
    let status = $('#status').val()
    let due_date = $('#due_date').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title, description, status, due_date
        }
    }).done(_ => {
        // $(".modal").toogle()
        auth()
        // $(".modal").show()
        alertHandler('success add: ' + title)
        $('#title').val("")
        $('#description').val("")
        $('#status').val("")
        $('#due_date').val("")
    }).fail(err => {
        alertHandler(err.responseJSON)
        $('#title').val("")
        $('#description').val("")
        $('#status').val("")
        $('#due_date').val("")
    })
}

function updateBtn(id) {
    $('.updatePage').show()
    $('#main_page').hide()

    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/${id}`,
        headers: {
            access_token: localStorage.access_token
        }
    })
        .done(data => {
            // auth()
            const { todo } = data
            // console.log(todo.due_date);
            $("#todoid").val(todo.id)
            $('#newtitle').val(todo.title)
            $('#newdesc').val(todo.description)
            $('#newstatus').val(todo.status)
            $('#newdate').val(new Date(todo.due_date).toDateString())

        })
        .fail(err => {
            alertHandler(err.responseJSON)
        })


}


function update(event) {
    event.preventDefault()
    let newTitle = $('#newtitle').val()
    let newDescription = $('#newdesc').val()
    let newStatus = $('#newstatus').val()
    let newDate = $('#newdate').val()
    let id = +$("#todoid").val()
    let data = {
        title: newTitle,
        description: newDescription,
        status: newStatus,
        due_date: newDate
    }

    $.ajax({
        method: 'PUT',
        url: baseUrl + '/todos/' + id,
        headers: {
            access_token: localStorage.access_token
        },
        data
    }).done(_ => {
        auth()
        alertHandler('success editing todos with id: ' + id)
        $('#newtitle').val("")
        $('#newdesc').val("")
        $('#newstatus').val("")
        $('#newdate').val("")
    }).fail(err => {
        alertHandler(err.responseJSON)
        $('#newtitle').val("")
        $('#newdesc').val("")
        $('#newstatus').val("")
        $('#newdate').val("")

    })
}