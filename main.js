let BASEURL = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
    $('.logout').click(function () {
        localStorage.clear()
        auth()
    })

})

function toggleForm() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
}

function auth() {
    if (localStorage.access_token) {
        $('.login-page').hide()
        $('.main-page').show()
        $('.update-page').hide()
       
        // fetchBooks()
    } else {
        $('.login-page').show()
        $('.main-page').hide()
        $('.update-page').hide()
    }
}


function loginUser (event) {
    event.preventDefault()
    let email = $('#login-email').val()
    let password = $('#login-password').val()

    console.log("LOGIN FROM CLIENT");

    $.ajax({
        method: 'POST',
        url: BASEURL + '/users/login',
        data: {
            email,
            password
        }
    })
        .done(data => {
            console.log("LOGIN SUCCESS");
            localStorage.setItem('access_token', data.access_token)
            auth()
        })
        .fail(err => {
            console.log("LOGIN ERROR");
            console.log(err)
        })
}


function registerUser (event) {
    event.preventDefault()
    let email = $('#reg-email').val()
    let password = $('#reg-password').val()

    console.log("REGISTER FROM CLIENT");

    $.ajax({
        method: 'POST',
        url: BASEURL + '/users/register',
        data: {
            email,
            password
        }
    })
        .done(data => {
            console.log("REGISTER SUCCESS");
            auth()
        })
        .fail(err => {
            console.log("REGISTER ERROR");
            console.log(err,'errror')
        })
}

// AKU TAK BERANI MACAM2 SAMA NIH METHOD YG SATOE
function onSignIn(googleUser) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    let profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: BASEURL + "/users/googleLogin",
        headers: {
            access_token: id_token
        }
    })
    .done(response => {

        console.log("GOOGLE LOGIN SUCCESS");
        console.log(response);

        localStorage.setItem('access_token', response.access_token)
        auth()


        // setTimeout(function () {
        //     $(".success-msg").empty()
        // }, 5000)


    })
    .fail(err => {
        // let arr
        console.log("GOOGLE LOGIN ERROR");
        console.log(err);
        // console.log(`the response text is`);
        // console.log(err.responseText);
        // console.log("RESPONSE BODY");
        // arr = JSON.parse(err.responseText).errors
        // console.log(arr);

        // $(".error-msg").empty()
        // if(typeof arr === "string") {
        //     $(".error-msg").append(`<h3>${arr}</h3>`)
        // } else {
        //     arr.forEach(el => {
        //         $(".error-msg").append(`<h3>${el}</h3>`)
        //     })
        // }
        
        // setTimeout(function () {
        //     $(".error-msg").empty()
        // }, 5000)


    })
}
