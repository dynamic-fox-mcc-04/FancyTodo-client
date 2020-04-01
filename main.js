const baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    $( '.main-page' ).hide()
    $( '.register' ).hide()
    $( '.login' ).show()
    $( '#login-form' ).submit(login(event))
})

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
        console.log(data)
    })
    .fail(err => {
        err.responseJSON.errors.forEach(data => {
            console.log(data.message)
        })
    })
    
}

const toRegister = () => {
    event.preventDefault()
    $( '.login' ).hide()
    $( '.register' ).show()
}

const toLogin = () => {
    event.preventDefault()
    $( '.login' ).show()
    $( '.register' ).hide()
}