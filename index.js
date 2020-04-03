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
        $.ajax({
            url: BaseUrl+'/user/login',
            method: 'POST',
            data: {
                Email: $('#EmailLogin').val(),
                Password: $('#PasswordLogin').val()
            }
        })
            .done(function(result) {
                localStorage.setItem('Email', result.Email)
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
                $('#Project').empty()
                swal('Add Project Success', `Success Creating Project`, 'success')
                GenerateProject()
                RegisterClear()
            })
            .fail(function(err) {
                swal('Add Project Failed', err.responseJSON.message, 'error')
            })
    })
    //SELECT PROJECT (GENERATE TODO)
    $('#SelectProject').on('submit', function(e) {
        e.preventDefault()
        generateTodo()
    })  

    //CREATE TODO PROCEDURE
    $('#TodoCreate').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: BaseUrl+'/projects/todos/add',
            method: 'POST',
            data: {
                Title : $('#CreateTitle').val(),
                Content: $('#CreateContent').val(),
                DueDate: $('#CreateDate').val(),
                Status: $('#CreateStatus').val(),
                ProjectId: $('#Project').val()
            },
            headers: {
                Access_Token: localStorage.getItem('Access_Token')
            }
        })
            .done(function(result) {
                generateTodo()
                swal('Create Success', 'Successfully Create Todos,Press OK to dismiss', 'success')
                $('#CreateTodo').hide()
                $('#CreateTitle').val('')
                $('#CreateContent').val('')
                $('#CreateDate').val('')
                $('#todoBox').show()
                $('#Todos').show()
            })
            .fail(function(err) {
                swal('Create Failed',err, 'error')
            })
    })
})
//UPDATE TODO PROCEDURE
$('#TodoUpdate').on('submit', function(e) {
    e.preventDefault()
        $.ajax({
            url: BaseUrl+`/projects/todos/${$('#UpdateId').val()}`,
            method: 'PATCH',
            headers: {
                Access_Token: localStorage.getItem('Access_Token')
            },
            data: {
                Title : $('#UpdateTitle').val(),
                Content: $('#UpdateContent').val(),
                DueDate: $('#UpdateDate').val(),
                Status: $('#UpdateStatus').val(),
                ProjectId: $('#Project').val()
            }
        })
            .done(function(result) {
                generateTodo()
                $('#todoBox').show()
                $('#Todos').show()
                $('#UpdateTodo').hide()
                swal('Update Success', result.msg, 'success')
            })
            .fail(function(err) {
                swal('Update Failed', err, 'error')
            })
})
//Add Friend Procedure
$('#AddFriend').on('click', function(e) {
    e.preventDefault()
    $.ajax({
        url: BaseUrl+`/projects/friend`,
        method: 'POST',
        headers: {
            Access_Token: localStorage.getItem('Access_Token')
        },
        data: {
            Email: $('#MemberEmail').val(),
            ProjectId: $('#Project').val()
        }
    })
        .done(function(result) {
            swal('Add Friend Success!', 'Please Click OK to proceed', 'success')
            generateTodo()
        })
        .fail(function(err) {
            swal('Add Friend Failed!', err.responseJSON.message, 'error')
        })
})
//Delete Friend Procedure
$('#DeleteFriend').on('click', function(e) {
    e.preventDefault()
    $.ajax({
        url: BaseUrl+`/projects/friend`,
        method: 'DELETE',
        headers: {
            Access_Token: localStorage.getItem('Access_Token')
        },
        data: {
            Email: $('#MemberEmail').val(),
            ProjectId: $('#Project').val()
        }
    })
        .done(function(result) {
            swal('Delete Friend Success!', 'Please Click OK to proceed', 'success')
            generateTodo()
        })
        .fail(function(err) {
            swal('Add Friend Failed!', err.responseJSON.message, 'error')
        })
})