let baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
    $('.logout').click(function(){
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
            showMessage('User signed out.');
        });
        localStorage.clear()
        $('.divTable').empty()
        auth()
    })
})

function showMessage(arr){
    $('.showMessage').empty() ;

    if (typeof arr == 'string'){
        arr = [arr] ;
        arr.forEach(element => {
            $('.showMessage').append(`-${element}-`)
        });
    } 
    else {
        arr.forEach(element => {
            $('.showMessage').append(`-${element}-`)
        });
    }
}

function home (event) {
    event.preventDefault();
    $('.registerPage').hide()
    $('.homePage').show()
    $('.loginPage').hide()
}

function regist (event) {
    event.preventDefault();
    $('.registerPage').show()
    $('.homePage').hide()
    $('.loginPage').hide()

    let email =$('#emailRegist').val()
    let password =$('#passwordRegist').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/register',
        data: { 
            email,
            password
        }
    })
        .done(data => {
            localStorage.setItem('token', data.access_token)
            $('#emailRegist').val('')
            $('#passwordRegist').val('')
            showMessage('Successfully registered')
            auth()
            
        })
        .fail(err => {
            $('#emailRegist').val('')
            $('#passwordRegist').val('')

            if(err.responseJSON.error == undefined){
                showMessage(err.responseJSON.errors[0].message)
            }
            else{
                showMessage(err.responseJSON.error.errors[0].message)
            }
        })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;    
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/googleSign',
        data: {
            'id_token' : id_token,
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            showMessage("Success login");
            auth()
        })
        .fail(err => {
            showMessage(err.responseJSON, 'error')
        })
}


function login (event) {
    event.preventDefault();
    $('.registerPage').hide()
    $('.homePage').hide()
    $('.loginPage').show()

    let email =$('#emailLogin').val()
    let password =$('#passwordLogin').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/login',
        data: { 
            email,
            password
        }
    })
        .done(data => {
            localStorage.setItem('token', data.access_token)
            $('#emailLogin').val('')
            $('#passwordLogin').val('')
            showMessage("Success login");
            auth()
            
        })
        .fail(err => {
            showMessage(err.responseJSON.msg);
        })
}

function auth() {
    if(localStorage.token){
        $('.homePage').hide()
        $('.registerPage').hide()
        $('.loginPage').hide()
        $('.updatePage').hide()
        $('.mainPage').show()
        readTodos()
    }
    else {
        $('.updatePage').hide()
        $('.mainPage').hide()
        $('.registerPage').hide()
        $('.loginPage').hide()
        $('.homePage').show()
        apiShalat()
        apiwWather()
    }
}

function apiwWather() {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/api',
        headers: {
        }
    })
    .done(result=> {
        let mainWeather = result.cityWeather.weather
        let mainTemp = result.cityWeather.temp
        let weather = mainWeather.main
        let desc = mainWeather.description
        let temp = `${(mainTemp.temp-273.15).toFixed(2)} C`
        let feels_like = `${(mainTemp.feels_like-273.15).toFixed(2)} C`
        let tempMin = `${(mainTemp.temp_min-273.15).toFixed(2)} C`
        let tempMax = `${(mainTemp.temp_max-273.15).toFixed(2)} C`
        let pressure = `${mainTemp.pressure} hPa`
        let humidity = `${mainTemp.humidity}%`
        
        $('.weather').append(`
            <div class="weatherTable">
            <table border>
                <tr>
                    <th>Weather</th>
                    <td>${weather}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>${desc}</td>
                </tr>
                <tr>
                    <th>Temperature</th>
                    <td>${temp}</td>
                </tr>
                <tr>
                    <th>Feels Like</th>
                    <td>${feels_like}</td>
                </tr>
                <tr>
                    <th>Min Temperature</th>
                    <td>${tempMin}</td>
                </tr>
                <tr>
                    <th>Max Temperature</th>
                    <td>${tempMax}</td>
                </tr>
                <tr>
                    <th>Pressure</th>
                    <td>${pressure}</td>
                </tr>
                <tr>
                    <th>Humidity</th>
                    <td>${humidity}</td>
                </tr>
            </table>
        `)
    })
    .fail(err => {
        console.log(err, "error");
    })
}

function apiShalat(){
    $.ajax({
        method: 'GET',
        url: baseUrl + '/api',
        headers: {
        }
    })
    .done(result=> {        
        let schedule = result.shalatSchedule
        let date= schedule.date_for
        let fajr= schedule.fajr
        let dhuhr= schedule.dhuhr
        let asr= schedule.asr
        let maghrib= schedule.maghrib
        let isha=schedule.isha 

        $('.shalatSchedule').append(`
            <div class="shalatTable">
                <table border>
                    <tr>
                        <th>Date</th>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <th>Fajr</th>
                        <td>${fajr}</td>
                    </tr>
                    <tr>
                        <th>Dhuhr</th>
                        <td>${dhuhr}</td>
                    </tr>
                    <tr>
                        <th>Asr</th>
                        <td>${asr}</td>
                    </tr>
                    <tr>
                        <th>Maghrib</th>
                        <td>${maghrib}</td>
                    </tr>
                    <tr>
                        <th>Isha</th>
                        <td>${isha}</td>
                    </tr>
                </table>
            </div>
        `)
    })
    .fail(err => {
        console.log(err, "error");
    })
} 

function readTodos () {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.token
        }
    })
        .done(data => {
            $('.todoList').empty()
            for(let i=0; i< data.todo.length; i++){
                let id = data.todo[i].id
                let title = data.todo[i].title
                let description = data.todo[i].description
                let status = data.todo[i].status
                    if(status == false) {
                        status = 'Pending'
                    }
                    else {
                        status = "Complete"
                    }
                    let due_date = new Date (data.todo[i].due_date)
                    let year = due_date.getFullYear()
                    let month = due_date.getMonth() + 1 
                    let day = due_date.getDate()
                    if(month < 10) {
                        month = `0${month}`
                    }
                    if(day < 10) {
                        day = `0${day}`
                    }
                    
                    let formatDate = day + "-" + month + "-" + year

                if(status == "Pending") {
                    $('.todoList').append(`
                        <div class="card">
                            <h3>${title}</h3>
                            <p>Description: ${description}<p>
                            <p>Due date: ${formatDate}<p>
                            <p>Status: ${status}<p>
                            <button onClick="updateBtn(${id}, event)" class="btn btn-success" >Edit</button> <button onClick="deleteBtn(${id})" class="btn btn-warning">Delete</button>
                        </div>
                    `)
                }
                else {
                    $('.todoList').append(`
                        <div class="card">
                            <h3>${title}</h3>
                            <p>Description: ${description}<p>
                            <p>Due date: ${formatDate}<p>
                            <p>Status: ${status}<p>
                            <button onClick="updateBtn(${id}, event) " class="btn btn-success">Edit</button> <button onClick="deleteBtn(${id})" class="btn btn-warning">Delete</button>
                        </div>
                    `)
                }
            }
        })
        .fail(err => {
            console.log(err, "error");
        })
}

function createTodo(event) {
    event.preventDefault()
    let title =$('#title').val()
    let description = $('#description').val()
    let due_date =$('#due_date').val()

    $.ajax({  
        method: 'POST',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(data => {
            showMessage("Successfully created new todo");
            
            auth()
            $('.createTodo').hide()
            $('#title').val('')
            $('#description').val('')
            $('#due_date').val('')

        })
        .fail(err => {
            if(err.responseJSON.error == undefined){
                showMessage(err.responseJSON.errors[0].message)
            }
            else{
                showMessage(err.responseJSON.error.errors[0].message)
            }
        })
}

function registerBtn() {
    $('.registerPage').show()
    $('.homePage').hide()
    $('.loginPage').hide()
}

function loginBtn() {
    $('.registerPage').hide()
    $('.homePage').hide()
    $('.loginPage').show()
}

function backBtn(event) {
    event.preventDefault()
    $('.updatePage').hide()
    $('.mainPage').show()

}

function updateBtn(id, event) {
    event.preventDefault()
    $('.updatePage').show()
    $('.mainPage').hide()

    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos/'+id,
        headers: {
            access_token: localStorage.token
        }
    })
        .done(data=> {
            let due_date = new Date (data.todo.due_date)
            let year = due_date.getFullYear()
            let month = due_date.getMonth() + 1 
            let day = due_date.getDate()
            if(month < 10) {
                month = `0${month}`
            }
            if(day < 10) {
                day = `0${day}`
            }
            let formatDate = year + "-" + month + "-" + day
            
            $('#editId').val(data.todo.id)
            $('#editTitle').val(data.todo.title)
            $('#editDescription').val(data.todo.description)
            $('#editDue_date').val(formatDate)

        })
        .fail(err => { 
            console.log(err, "error");
        })
}

function updateTodo(event){
    event.preventDefault()
    const id =  $('#editId').val()
    let title =$('#editTitle').val()
    let description = $('#editDescription').val()
    let due_date =$('#editDue_date').val()
    let status = $('#editStatus').val()
   
    $.ajax({ 

        method: 'PUT',
        url: baseUrl + '/todos/'+id,
        headers: {
            access_token: localStorage.token
        },
        data: {
            title,
            description,
            due_date,
            status
        }
    })
        .done(data=> {
            showMessage("Successfully edited todo");
            $('.updatePage').hide()
            $('.mainPage').show()
            readTodos()

         })
        .fail(err => {
            console.log(err, "error");
        })
}

function deleteBtn(id) {
    $.ajax({
        method: 'delete',
        url: baseUrl + '/todos/'+id,
        headers: {
            access_token: localStorage.token
        }
    })
    .done((response)=> {
        showMessage("Successfully deleted todo");
        readTodos()
    })
    .fail(err => {
        console.log(err, "error");
    })
}