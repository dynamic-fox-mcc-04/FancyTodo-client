let baseUrl = 'http://localhost:3000'

$(document).ready(function() {
    $('.addNewTodo').hide()
    $('.homepage').hide()
    $('.register-page').hide()

    $("#login").submit(function(event) {
        event.preventDefault()
        let email = $('#email').val()
        let password = $('#password').val()
        console.log(email, password);

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

            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    });

    $('#register').submit((event) => {
        event.preventDefault()
        let email = $('#email').val()
        let password = $('#password').val()

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
                    // console.log(data.access_token);

            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    })
});