const BaseUrl = 'http://localhost:3000'

$(document).ready(function() {
    if(localStorage.getItem('Access_Token')) {
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
    //TOMBOL LOGOUT
    $('#Logout').on('click', function() {
        Logout()
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
            RegisterClear()

        })
        .fail(function(err){
            swal("Too Bad", err.responseJSON.message, "error");
            RegisterClear()

        })
    }) 
    //LOGIN PROCEDURE
    $('#FormLogin').on('submit', function(e) {
        e.preventDefault()
        console.log($('#EmailLogin').val())
        console.log($('#PasswordLogin').val())
        $.ajax({
            url: BaseUrl+'/user/login',
            method: 'POST',
            data: {
                Email: $('#EmailLogin').val(),
                Password: $('#PasswordLogin').val()
            }
        })
            .done(function(result) {
                localStorage.setItem('Access_Token', result.Access_Token)
                swal('Login Success', `You Are Accessing From IP ${result.geolocation.ip}, Location ${result.geolocation.city}`, 'success')
                SignedIn()
                LoginClear()
            })
            .fail(function(err) {
                swal('Login Failed', err.responseJSON.message, 'error')
                LoginClear()
            })
        
    })
    //CREATE PROJECT PROCEDURE
    $('#AddProject').on('submit', function(e) {
        e.preventDefault()
        console.log($('#ProjectName').val())
        $.ajax({
            url: BaseUrl+'/projects/add',
            method: 'POST',
            headers: {
                Access_Token: localStorage.getItem('Access_Token')
            },
            data: {
                Title: $('#ProjectName').val()
            }
        })
            .done(function(result) {
                swal('Add Project Success', `Success Creating Project`, 'success')
                console.log(result)
                GenerateProject()
                RegisterClear()
            })
            .fail(function(err) {
                console.log(err)
                swal('Add Project Failed', err.responseJSON.message, 'error')
            })
    })
    //SELECT PROJECT (GENERATE TODO)
    $('#SelectProject').on('submit', function(e) {
        e.preventDefault()
        console.log($('#Project').val())

    })

    //CREATE TODO PROCEDURE
    $('#TodoCreate').on('submit', function(e) {
        e.preventDefault()
        console.log($('#CreateTitle').val())
        console.log($('#CreateContent').val())
        console.log($('#CreateDate').val())
        console.log($('#CreateStatus').val())
    })
})