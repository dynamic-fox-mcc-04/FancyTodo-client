function StartNotSignedIn() {
    $('#Logout').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#MainBody').hide()

}

function StartSignedIn() {
    $('#Login').hide()
    $('#Register').hide()
    $('#LoginForm').hide()
    $('#RegisterForm').hide()
    $('#MainBody').show()

}

function Login() {
    //Button
    $('#Login').show()
    $('#Register').show()
    $('#Logout').hide()
    //Body
    $('#LoginForm').show()
    $('#RegisterForm').hide()
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
    $('#MainBody').hide()
}

