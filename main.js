const baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    $( '.main-page' ).show()
    auth()
    $( '#login-form' ).submit(login(event))
    $( '#register-form' ).submit(register(event))
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
        console.log(data)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
        auth()
    })
    
}

const auth = () => {
    if  (localStorage.access_token) {
        $( '.main-page' ).show()
        $( '.register' ).hide()
        $( '.login' ).hide()
    } else {
        $( '.main-page' ).hide()
        $( '.register' ).hide()
        $( '.login' ).show()
    }
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