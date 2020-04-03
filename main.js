const baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
})

const register = (event) => {
    event.preventDefault()
    const email = $( '#email-register' ).val()
    const password = $( '#password-register' ).val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/signup',
        data: {
            email,
            password
        }
    })
    .done(data => {
        localStorage.setItem('access_token', data.accessToken)
        auth()
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
        auth()
    })
}

const login = (event) => {
    event.preventDefault()
    const email = $( '#email-login' ).val()
    const password = $( '#password-login' ).val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/signin',
        data: {
            email,
            password
        }
    })
    .done(data => {
        localStorage.setItem('access_token', data.accessToken)
        auth()
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
        auth()
    })
    
}

const logout = (event) => {
    event.preventDefault()
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    auth()
}

const auth = () => {
    if  (localStorage.access_token) {
        mainPageShow()
        $( '.register' ).hide()
        $( '.login' ).hide()
    } else {
        $( '.main-page' ).hide()
        $( '.register' ).hide()
        $( '.login' ).show()
    }
}

const mainPageShow = () => {
    $( '.main-page' ).show()
    readTask()
    readTime()
}

const toRegister = (event) => {
    event.preventDefault()
    $( '.login' ).hide()
    $( '.register' ).show()
}

const toLogin = (event) => {
    event.preventDefault()
    $( '.login' ).show()
    $( '.register' ).hide()
}

const addTask = (event) => {
    event.preventDefault()
    const title = $( '#title-modal' ).val()
    const description = $( '#description-modal' ).val()
    const due_date = $( '#date-modal' ).val()
    console.log(title, description, due_date)
    $.ajax({
        method: 'POST',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + '/tasks',
        data: {
            title,
            description,
            due_date
        }
    })
    .done(data => {
        readTask()
        console.log(data)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
    
}

const deleteTask = (event, id) => {
    event.preventDefault()
    $.ajax({
        method: 'DELETE',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/tasks/${id}`
    })
    .done(data => {
        readTask(event)
        console.log(data)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}

const readTask = (event) => {
    $.ajax({
        method: 'GET',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/tasks`
    })
    .done(data => {
        $( '#page-content-wrapper' ).empty()
        $( '#page-content-wrapper' ).append(`<nav id="pcw-nav" class="d-flex align-items-center justify-content-lg-between navbar navbar-expand-lg navbar-light bg-light border-bottom m-1">
        <button class="btn btn-primary" id="menu-toggle" onclick="toggleUp(event)">Menu</button>
        <button class="btn btn-warning btn-md" id="add-task" data-toggle="modal" data-target="#myModal"><i class="fas fa-plus"></i></button>
        <h2>Tasks</h2>
    </nav>

    <div class="container-fluid d-flex flex-column align-items-center" id="task-container">
      
    </div>`)
        $( '#task-container' ).empty()
        let appends = ''
        data.tasks.forEach(datum => {
            let newDate = new Date(datum.due_date).toDateString()
            appends += `<div class="card m-1" style="width:400px;">
            <div class="card-body">
              <h4 class="card-title" id="card-title-${datum.id}">${datum.title}</h4>
              <p class="card-text" id="card-description-${datum.id}">${datum.description}</p>
            <div class="d-flex flex-row justify-content-lg-between align-items-center">
            <div>
                <button type="button" class="btn btn-primary btn-sm" onclick="readEditTask(${datum.id})"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-success btn-sm" onclick="updateCompleted(${datum.id}, true)"><i class="fas fa-check"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteTask(event, ${datum.id})"><i class="fas fa-trash"></i></button>
            </div> 
            <div>
            <p class="card-text" id="card-date-${datum.id}">${newDate}</p>
            </div>
            </div>
            </div>
          </div>\n`
        })
        $( '#task-container' ).append(appends)
        console.log(data)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}

const readCompleted = () => {
    $.ajax({
        method: 'GET',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/tasks?status=Finished`
    })
    .done(data => {
        console.log(data)
        $( '#page-content-wrapper' ).empty()
        $( '#page-content-wrapper' ).append(`<nav id="pcw-nav" class="d-flex align-items-center justify-content-lg-between navbar navbar-expand-lg navbar-light bg-light border-bottom m-1">
        <button class="btn btn-primary" id="menu-toggle" onclick="toggleUp(event)">Menu</button>
        <h2>Completed</h2></nav>
        <div class="container-fluid d-flex flex-column align-items-center" id="task-container">
        </div>`)
        let appends = ''
        data.tasks.forEach(datum => {
            let newDate = new Date(datum.due_date).toDateString()
            appends += `<div class="card m-1" style="width:400px;">
            <div class="card-body">
              <h4 class="card-title" id="card-title-${datum.id}">${datum.title}</h4>
              <p class="card-text" id="card-description-${datum.id}">${datum.description}</p>
            <div class="d-flex flex-row justify-content-lg-between align-items-center">
            <div>
                <button type="button" class="btn btn-primary btn-sm" onclick="readEditTask(${datum.id})"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-success btn-sm" onclick="updateCompleted(${datum.id}, false)"><i class="fas fa-backspace"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteTask(event, ${datum.id})"><i class="fas fa-trash"></i></button>
            </div> 
            <div>
            <p class="card-text" id="card-date-${datum.id}">${newDate}</p>
            </div>
            </div>
            </div>
          </div>\n`
        })
        $( '#task-container' ).append(appends)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}

const updateCompleted = (id, tag) => {
    const title = $( `#card-title-${id}` )[0].innerHTML
    const description = $( `#card-description-${id}` )[0].innerHTML
    const due_date = $( `#card-date-${id}` )[0].innerHTML
    let status
    if (tag) {
        status = 'Finished'
    } else {
        status = 'Unfinished'
    }
    $.ajax({
        method: 'PUT',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/tasks/${id}`,
        data: {
            title,
            description,
            status,
            due_date: new Date(due_date).toISOString(),
        }
    })
    .done(data => {
        if(tag) {
            readTask()
        } else {
            readCompleted()
        }
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}
const toggleUp = (e) => {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
}

const readEditTask = (id) => {
    const title = $( `#card-title-${id}` )[0].innerHTML
    const description = $( `#card-description-${id}` )[0].innerHTML
    const due_date = $( `#card-date-${id}` )[0].innerHTML
    let newDate = new Date(due_date)
    console.log(newDate)
    let month, year, day
    year = newDate.getFullYear()
    if (newDate.getMonth() < 10) {
        month = `0${newDate.getMonth()+1}`
    } else {
        month = newDate.getMonth() + 1
    }

    if (newDate.getDate() < 10) {
        day = `0${newDate.getDate()}`
    } else {
        day = newDate.getDate()
    }
    $("#date").val(`${year}-${month}-${day}`)
    $("#title").val(title)
    $("#description").val(description)
    $("#edit-task").attr('onclick', `editTask(${id})`)
}

const editTask = (id) => {
    const date = $("#date").val()
    const title = $("#title").val()
    const description = $("#description").val()
    $.ajax({
        method: 'PUT',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/tasks/${id}`,
        data: {
            title,
            description,
            due_date: new Date(date).toISOString(),
        }
    })
    .done(data => {
        readTask()
        $("#date").val('')
        $("#title").val('')
        $("#description").val('')
        $("#edit-task").attr('onclick', ``)
    })
    .fail(err => {
        $("#date").val('')
        $("#title").val('')
        $("#description").val('')
        $("#edit-task").attr('onclick', ``)
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}

const readHoliday = () => {
    let appends = `<div class="card-body">
    <h4 class="card-title" id="card-title-23">Liburan</h4>
    <p class="card-text" id="card-description-23">ke Bali</p>
  <div class="d-flex flex-row justify-content-lg-between align-items-center">
  <div>
      <button type="button" class="btn btn-primary btn-sm" onclick="readEditTask(23)"><i class="fas fa-edit" aria-hidden="true"></i></button>
      <button type="button" class="btn btn-success btn-sm" onclick="updateCompleted(23, true)"><i class="fas fa-check" aria-hidden="true"></i></button>
      <button type="button" class="btn btn-danger btn-sm" onclick="deleteTask(event, 23)"><i class="fas fa-trash" aria-hidden="true"></i></button>
  </div> 
  <div>
  <p class="card-text" id="card-date-23">Fri Jan 01 2021</p>
  </div>
  </div>
  </div>`

  $("#card-holiday").append(appends)
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/googleSign',
        data: {
            token: id_token
        }
    })
    .done(data => {
        console.log(data)        
        localStorage.setItem('access_token', data.accessToken)
        auth()
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
        auth()
    })
}

const readTime = () => {
    $.ajax({
        method: 'GET',
        headers: {
            'access_token': localStorage.access_token
        },
        url: baseUrl + `/features/time`
    })
    .done(response => {
        console.log(response)
        let appends = ''
        let dateTime
        $('#detail-time').empty()
        for (let key in response.data) {
            console.log(response.data[key])
            if (key == 'date_for') {
                dateTime = response.data[key]
            } else {
                appends += `<div class="col">
                <div class="card m-1" style="height: 60px" >
                  <div class="card-body d-flex flex-row justify-content-lg-between">
                    <div>${key} </div>
                    <div>${response.data[key]}</div>
                  </div>
                </div>
              </div>`
            }

        }
        $('#time-prayer-date').empty()
        $('#time-prayer-date').append(dateTime)
        $('#detail-time').append(appends)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
}