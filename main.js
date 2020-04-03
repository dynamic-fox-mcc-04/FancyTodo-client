let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    authentication()
});

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $.ajax({
        method:'POST',
        url:baseUrl+'/user/googlesign',
        data: {
            id_token
        }
    })
        .done(data => {
            localStorage.setItem('access_token',data.access_token)
            authentication()
            // console.log(data)
        })
        .fail(err => {
            console.log(err)
        })
  }
  

    function login(event) {
        event.preventDefault();

        let email= $('#email').val()
        let password= $('#password').val()
        // console.log(email,password)
        $.ajax({
            method:'POST',
            url:baseUrl+'/user/signin',
            data: {
                email,
                password
            }
        })
            .done(data => {
                localStorage.setItem('access_token',data.access_token)
                authentication()
            })
            .fail(err => {
                console.log(err.responseJSON)
            })
      };
      
      
      function registerPage() {
          $('.registerPage').show()
          $('.loginPage').hide()
      }

      function register(event) {
        event.preventDefault()
        let email= $('#emailRegister').val()
        let password= $('#passwordRegister').val()
        console.log(email,password)
        $.ajax({
            method:'POST',
            url:baseUrl+'/user/signup',
            data: {
                email,
                password
            }
        })
            .done(data => {
                console.log(data)
                localStorage.setItem('access_token',data.access_token)
                // authentication()
            })
            .fail(err => {
                console.log(err.responseJSON)
            })
      }
      function authentication(){
        if(localStorage.access_token) {
            fetchTodoList()
            $('.loginPage').hide()
            $('.mainPage').show()
            $('.modal').hide()
            $('.updatePage').hide()
            $('.registerPage').hide()
        } else {
            $('.loginPage').show()
            $('.mainPage').hide()
            $('.modal').hide()
            $('.updatePage').hide()
            $('.registerPage').hide()
        }
    }

    function fetchTodoList() {
        $.ajax({
            method: 'GET',
            url: baseUrl+ '/todos',
            headers:{
                access_token: localStorage.access_token
            }
        })
            .done(data => {
                $('.todoList').empty()
                $('.todoList').append(`
                <div class= "cardhead">
                    <table border>
                        <thead>
                            <th id="titleHeadTodo">Title</th>
                            <th id="descriptionHeadTodo">Description</th>
                            <th id="duedateHeadTodo">Due Date</th>
                            <th id="statusHeadTodo">Status</th>
                            <th id="actionHeadTodo">Action</th>
                        </thead>
                    </table>
                <div>
            `)
                for(let i= 0; i < data.Todo.length; i++) {
                    let id = data.Todo[i].id
                    let title= data.Todo[i].title
                    let description = data.Todo[i].description
                    let status=''
                    if(data.Todo[i].status == true) {
                        status = 'Finished'
                    } else {
                        status = 'Unfinished'
                    }
                    let year = new Date(data.Todo[i].due_date).getFullYear()
                    let month = new Date(data.Todo[i].due_date).getMonth()
                    let date = new Date(data.Todo[i].due_date).getDate()
                    let due_date= year+'/'+month+'/'+date
                    console.log(id)
                    $('.todoList').append(`
                        <div class= "cardlist">
                            <table border>
                                <tr>
                                    <td id="titleTodoList"><h4>"${title}"</h4></td>
                                    <td id="descriptionTodoList"><h4>"${description}"</h4></td>
                                    <td id="statusTodoList"><h4>"${status}"</h4></td>
                                    <td id="duedateTodoList"><h4>"${due_date}"</h4></td>
                                    <td id="actionTodoList"> <button onclick="updateBtn(${id})">Edit</button> <button onclick="deleteBtn(${id})">Delete</button></td>
                                </tr>
                            </table>
                        <div>
                    `)
                }
            })
            .fail(err => {
                console.log(err)
            })
        }

    function createTodoForm(){
        $('.modal').show()
        $('.loginPage').hide()
        $('.mainPage').hide()
    }
    function createTodo(event) {
        event.preventDefault();
        let title= $('#title').val()
        let description= $('#description').val()
        let due_date= $('#due_date').val()
        $.ajax({
            method:'POST',
            url:baseUrl+'/todos',
            headers:{
                access_token: localStorage.access_token
            },
            data: {
                title,
                description,
                due_date
            }
        })
            .done(() => {
                authentication()
                $('.modal').hide()
                $('.mainPage').show()
                // let title= $('#title').val()
                // let description= $('#description').val()
                // let status= $('#status').val()
                // let due_date= $('#due_date').val()
            })
            .fail(err => {
                console.log(err)
            })
    }

    function updateBtn(id) {
        // console.log(id)
        $('.updatePage').show()
        $('.mainPage').hide()
        $.ajax({
            method:'GET',
            url:baseUrl+'/todos/'+ id,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(data => {
            // console.log(data.Todo[0].title)
            $('.updatePage').empty()
            $('.updatePage').append(`
            <form autocomplete="off" onsubmit="updateTodo(event)">
            <h1>Update Todo Data</h1>
            <input id="idUpdate" type="hidden" value="${data.Todo[0].id}">
            <input id="titleUpdate" type="text" value="${data.Todo[0].title}">
            <input id="descriptionUpdate" type="text" value="${data.Todo[0].description}">
            <input id="due_dateUpdate" type="text" value="${data.Todo[0].due_date}">
            <select id="statusUpdate">
            <option selected value="true">Finished</option>
                <option value="false">Unfinished</option>
            </select>
            <input type="submit" value="submit">
            </form> 
            `)
        })
        .fail(err => {
            console.log(err,'error')
        })
    }

    function updateTodo(event) {
        event.preventDefault()
        let id= $('#idUpdate').val()
        let title= $('#titleUpdate').val()
        let description= $('#descriptionUpdate').val()
        let status= $('#statusUpdate').val()
        let due_date= $('#due_dateUpdate').val()
        $.ajax({
            method:'PUT',
            url:baseUrl+'/todos/'+ id,
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
    function deleteBtn(id) {
        $.ajax({
            method: 'DELETE',
            url: baseUrl+'/todos/'+id,
            headers: {
                access_token: localStorage.access_token
            }
        })
            .done(() => {
                authentication()
            })
            .fail(err => {
                console.log(err)
            })
    }

    function logout() {
        localStorage.clear()
        authentication()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    }
  