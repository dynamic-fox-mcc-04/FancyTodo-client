let baseUrl = 'http://localhost:3000'

$(document).ready(function () {
    auth()
})

function auth() {
    if (localStorage.access_token) {
        $('#loginTodo').hide()
        $('#main_page').show()
        fetchData()
    } else {
        $('#loginTodo').show()
        $('#main_page').hide()
    }
}

function login(event) {
    event.preventDefault();

    let email = $("#email").val()
    let password = $("#password").val()
    // console.log(email, password)
    $.ajax({
        method: 'POST',
        url: baseUrl + '/login',
        data: {
            email,
            password
        }
    }).done(datum => {
        // console.log(datum, 'datum')/
        localStorage.setItem('access_token', datum.access_token)
        auth()
    }).fail(err => {
        console.log(err.responseJSON.msg, 'err')
        // function (xhr) {
        //     alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
        // }
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
        const { user } = data
        console.log(data)
        for (let i = 0; i < todo.length; i++) {
            let todoEl = todo[i]
            productsAdd(todoEl)
        }
        showEmail(user)
    }).fail(err => {
        console.log(err)
    })
}

function productsAdd(todoEl) {
    $("#todo_list tbody").append(
        "<tr>" +
        `<td>${todoEl.id}</td>` +
        `<td>${todoEl.title}</td>` +
        `<td>${todoEl.description}</td>` +
        `<td>${todoEl.status}</td>` +
        `<td>${new Date(todoEl.due_date).toDateString()}</td>` +
        `<td><a href="#"><button>Delete</button></a>
        <button href="#"><button>Update</button></button></td>` +
        "</tr>"
    );
}

function showEmail(email) {
    $(".showEmail").append(
        `<p>User: ${email}</p>`
    )
}