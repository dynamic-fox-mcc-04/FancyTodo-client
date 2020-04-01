let baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    $( "#login" ).submit(function( event ) {
        event.preventDefault();
        let email =$('#email').val()
        let password =$('#password').val()
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
                // console.log(data.access_token);
                
            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    });
});