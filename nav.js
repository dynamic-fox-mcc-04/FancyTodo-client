function StartNotSignedIn() {
    $('#Logout').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#ProjectBody').hide()
    $('#MainBody').hide()

}

function StartSignedIn() {
    $('#Login').hide()
    $('#Register').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#MainBody').hide()
    $('#ProjectBody').show()
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
    localStorage.removeItem('Access_Token')
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
            console.log(result)

        })
        .fail(function(err) {
            console.log(err)
        })
}

//Google Login
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log('testing google sign in')
}