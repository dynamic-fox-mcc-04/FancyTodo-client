function monthConvert(month) {
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

function fetchTodo() {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/todos',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((todo) => {
      console.log(todo[0].status, 'ini statusnya');
      $('#todos').empty()
      for (let i = 0; i < todo.length; i++) {
        let date = new Date(todo[i].due_date).toISOString().substring(0, 10)
        let year = date.substring(0, 4)
        let month = date.substring(5, 7)
        let day = date.substring(8, 10)

        month = monthConvert(month)
        let newDate = `${day} ${month} ${year}`
        let statusIcon = ''
        if (todo[i].status) {
          statusIcon = `<i class="far fa-check-circle fa-5x done"></i>`
        } else {
          statusIcon = `<i class="far fa-times-circle fa-5x cross"></i>`
        }
        $('#todos').append(`
          <div class="card">
            <div class="card-body">
              <div class="todo-status">
                ${statusIcon}
              </div>
              <div class="main-todo">
                <h5 class="card-title">${todo[i].title}</h5>
                <p class="card-text">${todo[i].description}</p>
                <div class="todo-footer">
                  <p class="card-text" style="margin: 0;"><medium class="text-muted">${newDate}</medium></p>
                  <div class="todo-options">
                    <i onclick="editTodo(${todo[i].id})" class="far fa-edit fa-lg"    style="margin-right: 15px;"></i>
                    <i onclick="deleteTodo(${todo[i].id})" class="far fa-trash-alt    fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `)
      }
    })
    .fail((err) => {
      console.log(err);
    })
}

function fecthWeather() {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/weather'
  })
    .done((weather) => {
      // console.log(weather);
      $('.segment-two').append(`
        <div id="icon">
          <img ${weather.data}
        </div>
        <div id="weather-status">
          <h3>${weather.city}</h3>
          <p>${Math.round(weather.weather.the_temp)}&#8451</p>
          <h5>${weather.weather.weather_state_name}</h5>
        </div>
      `)
    })
    .fail((err) => {
      console.log(err);
    })
}

function getName() {
  let name = localStorage.getItem('name')
  $('.segment-one').append(`
    <h1>Welcome <span>${name}</span></h1>
  `)
}

$(document).ready(function () {
  let token = localStorage.getItem('token')
  if (token) {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    getName()
    fecthWeather()
    fetchTodo()
  } else {
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
  }

  $('#login-form').on('submit', function (event) {
    event.preventDefault()
    let email = $('#login-email').val()
    let password = $('#login-password').val()
    let name;
    let token;
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/login',
      data: {
        email,
        password
      }
    })
      .done((data) => {
        name = data.name
        token = data.token
        localStorage.setItem('token', token)
        localStorage.setItem('name', name)
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        getName()
        fecthWeather()
        fetchTodo()
      })
      .fail(err => {
        console.log(err);
      })
  })

  $('#register-form').on('submit', function (event) {
    event.preventDefault()
    let name = $('#register-name').val()
    let email = $('#register-email').val()
    let password = $('#register-password').val()
    let token;
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/register',
      data: {
        name, email, password
      }
    })
      .done((data) => {
        token = data.token
        localStorage.setItem('token', token)
        localStorage.setItem('name', name)
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        getName()
        fecthWeather()
        fetchTodo()
      })
      .fail(err => {
        console.log(err);
      })
  })

  $('#join-btn').on('click', function () {
    $('#register-page').show()
    $('#login-page').hide()
    $('#dashboard-page').hide()
  })

  $('#login-btn').on('click', function () {
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
  })
})