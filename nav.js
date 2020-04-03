function StartNotSignedIn() {
    $('#Logout').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#ProjectBody').hide()
    $('#MainBody').hide()
    $('#CreateTodo').hide()
    $('#UpdateTodo').hide()
    $('#Todos').hide()
    $('#TodoTable').hide()
    $('#CreateTodo').hide()
    $('#UpdateTodo').hide()


    

}

function StartSignedIn() {
    $('#Login').hide()
    $('#Register').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#MainBody').hide()
    $('#ProjectBody').show()
    $('#Todos').hide()
    $('#TodoTable').hide()
    $('#CreateTodo').hide()
    $('#UpdateTodo').hide()
    $('#CreateTodo').hide()
    $('#UpdateTodo').hide()
    GenerateProject()
}


function Login() {
    //Button
    $('#Login').show()
    $('#Register').show()
    $('#Logout').hide()
    //Body
    $('#LoginForm').show()
    $('#RegisterForm').hide()
    $('#ProjectBody').hide()
    $('#MainBody').hide()

}

function Register() {
    //Button
    $('#Login').show()
    $('#Register').show()
    $('#Logout').hide()
    //Body
    $('#LoginForm').hide()
    $('#RegisterForm').show()
    $('#ProjectBody').hide()
    $('#MainBody').hide()
}

function Logout() {
    //Button
    $('#Login').show()
    $('#Register').show()
    $('#Logout').hide()
    //Body
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#ProjectBody').hide()
    $('#MainBody').hide()
    $('#Todos').hide()
    $('#TodoTable').hide()
    $('#CreateTodo').hide()
    $('#UpdateTodo').hide()
    localStorage.removeItem('Access_Token')
    localStorage.removeItem('Email')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
    //empty reset
    FormClear()
    

}

function LoginClear() {
    $("#EmailLogin").val("")
    $("#PasswordLogin").val("")
}

function RegisterClear() {
    $("#EmailRegister").val("")
    $("#PasswordRegister").val("")
}

function FormClear() {
    $("#Project").empty()
    $("#ProjectName").val("")
    $("#Members").empty()
    $("#MemberEmail").val("")
    
}

function TodoClear() {
    $("#CreateTitle").val("")
    $("#CreateContent").val("")
    $("#CreateDate").val("")
}

function UpdateClear() {
    $("#UpdateTitle").val("")
    $("#UpdateContent").val("")
    $("#UpdateDate").val("")
}

function SignedIn() {
    //Button
    $('#Login').hide()
    $('#Register').hide()
    $('#Logout').show()
    //Body
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#ProjectBody').show()
    $('#MainBody').hide()
    GenerateProject()
}

function GenerateProject() {
    $.ajax({
        url: BaseUrl+'/projects/',
        method: "GET",
        headers: {
            Access_Token: localStorage.getItem('Access_Token')
        }
    })
        .done(function(result) {
            for(let i = 0; i < result.length; i++) {
                $('#Project').append(`
                <option value='${result[i].Project.id}'>${result[i].Project.Title}</option>
                `
                )

            }

        })
        .fail(function(err) {
            console.log(err)
        })
}

function generateTodo() {
    $.ajax({
        url: BaseUrl+'/projects/todos',
        method: 'POST',
        headers: {
            Access_Token: localStorage.getItem('Access_Token')
        },
        data: {
            ProjectId: $('#Project').val()
        }
    })
        .done(function(result) {
            $('#MainBody').show()
            $('#TodoBody').empty()
            $('#Members').empty()
            $('#Todos').show()
            $('#TodoTable').show()
            for(let i = 0; i < result.Todos.length; i++) {
                $('#TodoBody').append(`
                <tr>
                    <td>${result.Todos[i].Title}</td>
                    <td>${result.Todos[i].Content}</td>
                    <td>${result.Todos[i].DueDate}</td>
                    <td>${result.Todos[i].Status}</td>
                    <td><button id="UpdateTodo-${result.Todos[i].id}"> Update</button></td>
                    <td><button id="DeleteTodo-${result.Todos[i].id}">Delete</button></td>
                </tr>
                    `)
                $(`#UpdateTodo-${result.Todos[i].id}`).on('click', function(e) {
                    e.preventDefault()
                    $('#UpdateTodo').show()
                    $('#UpdateTitle').val(`${result.Todos[i].Title}`)
                    $('#UpdateContent').val(`${result.Todos[i].Content}`)
                    $('#UpdateDate').val(`${result.Todos[i].DueDate}`)
                    $('#UpdateStatus').val(`${result.Todos[i].Status}`)
                    $('#UpdateId').val(`${result.Todos[i].id}`)
                    $('#todoBox').hide()
                    $('#Todos').hide()
                })

                $(`#DeleteTodo-${result.Todos[i].id}`).on('click', function(e) {
                    $.ajax({
                        url:BaseUrl+`/projects/todos/${result.Todos[i].id}`,
                        method: "DELETE",
                        headers: {
                            Access_Token: localStorage.getItem('Access_Token')
                        },
                        data: {
                            ProjectId: $('#Project').val()
                        }
                    })
                    .done(function(result) {
                        swal('Delete Success', 'Successfully deleted the item you requested' , 'success')
                        generateTodo()
                    })
                    .fail(function(err) {
                        swal('Delete Failed', err, 'error')
                    })
                       
                      
                })
                
            }
            for(let i = 0; i < result.Members.length; i++) {
                if(result.Members[i].User.Email == localStorage.getItem('Email')) {
                    continue;
                }
                else {
                    $('#Members').append(`
                    <tr>
                        <td>${result.Members[i].User.Email}</td>
                    </tr>
                    `)

                }
            }
            
        })
        .fail(function(err) {
            console.log(err)
        })
}

//Update Cancel
$('#UpdateCancel').on('click', function(e) {
    e.preventDefault()
    $('#UpdateTodo').hide()
    $('#todoBox').show()
    $('#Todos').show()
})
//Create Cancel
$('#CreateCancel').on('click', function(e) {
    e.preventDefault()
    $('#CreateTodo').hide()
    $('#CreateTitle').val('')
    $('#CreateContent').val('')
    $('#CreateDate').val('')
    $('#todoBox').show()
    $('#Todos').show()
})
//Create Todo Button
$('#CreateTodoButton').on('click', function() {
    $('#CreateTodo').show()
    $('#todoBox').hide()
    $('#Todos').hide()
})
//Google Login
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: BaseUrl+'/user/googlelogin',
        method: 'POST',
        headers: {
            Access_Token: id_token
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
}
