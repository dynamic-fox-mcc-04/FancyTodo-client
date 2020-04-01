let baseUrl = 'http://localhost:3000'

$(document).ready(() => {
    // alert('welcome')
    auth()
})

function signout(){
    localStorage.clear()
    auth()
}

function auth() {
    if(localStorage.token){
        $('#Form-Login').hide()
        $('#Todo-List').show()
        fetchData()
    }else{
        $('#Form-Login').show()
        $('#Todo-List').hide()
    }
}

function signup(event) {
    event.preventDefault()
    const email = $('#email').val()
    const password = $('#password').val()
    console.log(email,password)
    $.ajax({
        method: 'POST',
        url: baseUrl + '/signup',
        data: {
            email,
            password
        }
    })
        .done(data => {
            console.log(data)
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err)
        })
}

function signin(event) {
    event.preventDefault()
    const email = $('#email').val()
    const password = $('#password').val()
    console.log(email, password)
    $.ajax({
        method: 'POST',
        url: baseUrl + '/signin',
        data: {
            email,
            password
        }
    })
        .done(data => {
            console.log(data)
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err)
        })
}

function fetchData() {
    $.ajax({
        method:'GET',
        url: baseUrl + '/todo',
        headers:{
            token: localStorage.token
        }
    })
    .done(data =>{
        for(let i in data){
            const title = data[i].title
            const description = data[i].description
            const status = data[i].status
            $('#Todo-list'),append(
                `<div class="card" style="width:70%">
                    <header class="header-container">
                        <h3>John Doe</h3>
                    </header>
                    <div class="body-container">
                        <p>1 new friend request</p>
                        <hr>
                        <img src="img_avatar3.png" alt="Avatar" class="w3-left w3-circle w3-margin-right"
                            style="width:60px">
                        <p>CEO at Mighty Schools. Marketing and Advertising. Seeking a new job and new opportunities.</p>
                        <br>
                    </div>
                    <button class="w3-button w3-block w3-dark-grey">+ Connect</button>
                </div>`
            )
        }
    })
    .fail(data =>{
        console.log(data)
    })
}

function createTodo() {

}

function updateTodo() {

}

function deleteTodo() {
}