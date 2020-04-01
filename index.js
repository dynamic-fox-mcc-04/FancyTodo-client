const BaseUrl = 'http://localhost:3000'
$(document).ready(function() {
    if(localStorage.getItem('AccessToken')) {
        StartSignedIn()
    }
    else {
        StartNotSignedIn()
    }
    //TOMBOL LOGIN
    $('#Login').on('click', function() {
        Login()

    })
    //TOMBOL HOME
    $('#Home').on('click', function() {
        if(localStorage.getItem('AccessToken')) {
            StartSignedIn()
        }
        else {
            StartNotSignedIn()
        }
    })
    //TOMBOL REGISTER
    $('#Register').on('click', function() {
        Register()
    })
    //REGISTER PROCEDURE
    $("#FormRegister").on('submit', function(e) {
        console.log(BaseUrl+'/user/register')
        e.preventDefault()
        $.ajax({
            url: BaseUrl+'/user/register',
            method: 'POST',
            data: {
                Email: $('#EmailRegister').val(),
                Password: $('#PasswordRegister').val()
            }
        })
        .done(function(result) {
            console.log(result)
            swal("Good job!", result.message, "success");

        })
        .fail(function(err){
            swal("Too Bad", err.responseJSON.message, "error");
        })
    }) 
    //LOGIN PROCEDURE
    
})