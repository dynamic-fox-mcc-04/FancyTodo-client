let baseUrl = "http://localhost:3000"
let idTemp = null

$( document ).ready(function() {
    auth()
    $( ".signout" ).click(function() {
        localStorage.clear()
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
              console.log('User signed out.');
            });
        auth()
    })
});

function auth() {
    if (localStorage.token) {
        $('.signIn-page').hide()
        $('.main-page').show()
        $('.update-page').hide()
        $('.add-todo-page').hide()
        getAllTodos()
    } else {
        $('.signIn-page').show()
        $('.main-page').hide()
        $('.update-page').hide()
        $('.add-todo-page').hide()
    }
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax ({
        method: 'POST',
        url: baseUrl + "/googleSign",
        data: {
            id_token
        }
    }) 
        .done(data => {
            // console.log(data, "ini data yang akan dikirim")
            localStorage.setItem("token", data.access_token)
            auth()
        })
        .fail(error => {
            console.log(error, "process gagal")
        })
}

function signIn( event ){
    event.preventDefault();

    let email = $('#email').val() //ambil value dari #email
    let password = $('#password').val() //ambil value dari #password
    // console.log(email, password, "email dan password di sini")
    $.ajax ({
        method: 'POST',
        url: baseUrl + "/signin",
        data: {
            email,
            password
        }
    }) 
        .done(data => {
            // console.log(data, "ini data yang akan dikirim")
            localStorage.setItem("token", data.access_token)
            auth()
        })
        .fail(error => {
            console.log(error, "process gagal")
        })
}

function getAllTodos(){
    $.ajax({
        method: 'GET',
        url: baseUrl + "/todos/",
        headers: {
            access_token: localStorage.token
        }
    })
    .done(data => {
        $('.all-todo-list').empty()
        for (let i = 0; i < data.allTodos.length; i++) {
            let id = data.allTodos[i].id
            let title = data.allTodos[i].title
            let description = data.allTodos[i].description
            let status = data.allTodos[i].status
            let StringDate = new Date(data.allTodos[i].due_date)
            let displayDate = StringDate.toISOString().substring(0, 10)
            let due_date = displayDate
            $('.all-todo-list').append(`
                    <div class="todo-card" style = "border: 1px solid #dddddd, padding="2px">
                        <div class="todo-card-body">
                            <h4 class="card-title">${title}</h4>
                            <p class="card-description">${description}</p>
                            <p class="card-due_date">${due_date}</p>
                            <p class="status">${status}</p>
                            <button class="update-todo" onclick="showUpdate(${id})">Update Task</button>
                            <button class="delete-todo" onclick="deleteTodo(${id})">Delete Task</button>
                        </div>
                    </div>
                `)
        
        }
    })
    .fail(error =>{
        console.log(error, "error di getAllTodos")
    })
}

function showAddForm( event ){
    $('.main-page').hide()
    $('.update-page').hide()
    $('.add-todo-page').show()
    // add-todo-page
    idTemp = id
    $.ajax({
        method:'GET',
        url: baseUrl + '/todos/' + id,
        headers: {
            access_token: localStorage.token
        }
    })
        .done(result => {
            console.log(result)
            let StringDate = new Date(result.todo.due_date)
            let displayDate = StringDate.toISOString().substring(0, 10)
            $('#update-title').val(result.todo.title)
            $('#update-description').val(result.todo.description)
            $('#update-due_date').val(displayDate)
        })
        .catch(error =>{
            console.log(error)
        })
}

function addTodos( event ){//disini
    event.preventDefault()
    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#due_date').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + "/todos",
        headers: {
            access_token: localStorage.token
        },
        data:{
            title,description,due_date
        } 
    })
        .done(result =>{
            auth()
            // $('.form-body').hide()
            $('#title').val("")
            $('#description').val("")
            $('#due_date').val("")
        })
        .catch(error => {
            console.log(error)
        })
}

function showUpdate(id) {
    $('.main-page').hide()
    $('.update-page').show()
    idTemp = id
    $.ajax({
        method:'GET',
        url: baseUrl + '/todos/' + id,
        headers: {
            access_token: localStorage.token
        }
    })
        .done(result => {
            console.log(result)
            let StringDate = new Date(result.todo.due_date)
            let displayDate = StringDate.toISOString().substring(0, 10)
            $('#update-title').val(result.todo.title)
            $('#update-description').val(result.todo.description)
            $('#update-due_date').val(displayDate)
        })
        .catch(error =>{
            console.log(error)
        })


}

function updateToDo( event ){
    // console.log(id)
    event.preventDefault()
    //Munculkan halaman edit dulu
    //kumpulin parameternya untuk diletakkan di ajax...
    // let title = $('#title').val()
    let title = $('#update-title').val()
    let description = $('#update-description').val()
    let due_date = $('#update-due_date').val()
    // let { title, description, status, due_date} = req.body
    $.ajax({
        method:'PUT',
        url: baseUrl + `/todos/` + idTemp,
        headers: {
            access_token: localStorage.token
        },
        data:{
            title,description,due_date
        } 
    })
        .done(result =>{
            auth()
            // $('#update-title').val("")
            // $('#update-description').val("")
            // $('#update-due_date').val("")
        })
        .catch(error => {
            console.log(error)
        })


}

function deleteTodo( id ){
    $.ajax({
        method:'DELETE',
        url: baseUrl + `/todos/` + id,
        headers: {
            access_token: localStorage.token
        },
    })
        .done(result => {
            auth()
        })
        .catch(error => {
            console.log(error)
        })
}