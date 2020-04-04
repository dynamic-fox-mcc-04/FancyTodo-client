let baseUrl = 'http://localhost:3000'
$('.updatePage').show()

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
            cuaca()
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
            $('.newsPage').hide()
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
                                    <td id="actionTodoList"> <button onclick="updateBtn(${id})">Edit</button> <button onclick="modalDelete(${id})">Delete</button></td>
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
        let title= $('#titleAdd').val()
        let description= $('#descriptionAdd').val()
        let due_date= $('#due_dateAdd').val()
        
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
                $('#titleAdd').val('')
                $('#descriptionAdd').val('')
                $('#due_dateAdd').val('')
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
            <div class="navbar">
            <ul id="listNavbar">
                <li><button onclick="authentication()">Home</button></li>
                <li><button onclick="logout()">News</button></li>
                <li><button onclick="logout()">Log Out</button></li>
            </ul>
            </div>
            <div class="update-body">
                <h1 id="h1UpdateTodo">Update Todo Data</h1>
                <form class="formUpdate" autocomplete="off" onsubmit="updateTodo(event)">
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
            </div>
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
        console.log('masuk')
        $.ajax({
            method: 'DELETE',
            url: baseUrl+'/todos/'+id,
            headers: {
                access_token: localStorage.access_token
            }
        })
            .done(() => {
                authentication()
                $('.modaldelete').hide()
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

    function cuaca() {
        $('.cuaca').empty()
        let city= 'depok'
        $.ajax({
            method: 'GET',
            url: baseUrl + '/api/weather/' + city,
            headers: {
                access_token: localStorage.access_token
            }
        })
            .done(data=>{
                console.log(data);
                $('.cuaca').append(`
                    <div class="mb-3">
                        <div>
                            <label style="color:#FFFFFF !important;">Status : </label>
                            <img src="https://www.weatherbit.io/static/img/icons/${data.data.data[0].weather.icon}.png" style="width:32px;">
                        </div>
                        <div>
                            <p>${data.data.data[0].weather.description}, Temp : ${data.data.data[0].temp}</p>
                        </div>
                        <div>
                            <label style="color:#FFFFFF !important;">City Name : </label>
                            <p>${data.data.data[0].city_name}</p>
                        </div>
                    </div>`
                )
            })
            .fail(err =>{
                console.log(err)
            })

        }
    
    function News() {
        $('.news-content').empty()
        $('.newsPage').show()
        $('.mainPage').hide()
        $('.modal').hide()
        $('.updatePage').hide()
        $('.registerPage').hide()
        
        const country = 'ID'
        $.ajax({
            method: 'GET',
            url: baseUrl + '/api/news/' + country,
            headers: {
                access_token: localStorage.access_token
            }
        })
            .done(data=>{
                console.log(data);
                for(let i in data.data.articles){
                    let title = data.data.articles[i].title
                    let author = data.data.articles[i].author
                    let content = data.data.articles[i].content
                    let urlToImage = data.data.articles[i].urlToImage
                    let url = data.data.articles[i].url
                    let date = data.data.articles[i].publishedAt
                    $('.news-content').append(
                        `<div class="card-news">
                            <img src="${urlToImage}" alt="" style="width: 100%;">
                            <div class="article-news">
                                <h4>${title}</h4>
                                <p>
                                    ${content}
                                </p>
                                <a href="${url}">View</a>
                            </div>
                            <div class="identity-news">
                                <b><label>${author}</label></b>
                                <label>${date}</label>
                            </div>
                        </div>`
                    )
                }
            })
            .fail(err =>{
                console.log(err)
            })
        }
    function modalDelete(id){
        $('.modaldelete').fadeIn()
        $('.modaldelete').append(`
        <div class="modaldelete-content">
            <h3>Are you sure want to delete this data ?</h3>
            <button onclick="deleteBtn(${id})">Yes</button>
        </div>
        `)
    }
  
