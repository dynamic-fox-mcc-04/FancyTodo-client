let baseUrl = "http://localhost:3000/";

$(document).ready(function()
{
    authentication();
    $(".register").hide();
    
    $("#login").submit(function( event ) {
        login(event)
      });
    $("#toRegister").click(function( event ) {
        $(".register").show();
        $(".login").hide();
    });
    $("#to-log-in").click(function( event ) {
        $(".register").hide();
        $(".login").show();
    });
    $("#register").submit(function( event ) {
        register(event)
    });
    $("#create-todo").submit(function( event ) {
        createTodo(event)
    });
    $("#to-show-todo").click(function( event ) {
        showTodo();
        $(".show-todo").show();
        $(".create-todo").hide();
    });
    $("#to-create-todo").click(function( event ) {
        $(".show-todo").hide();
        $(".create-todo").show();
    });
    $("#logout").click(function( event ) {
        localStorage.removeItem("accessToken");
        $(".create-todo").hide();
        $(".show-todo").hide();
        authentication();
    });
});

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

function authentication()
{
    $(".show-todo").hide();
    if(localStorage.accessToken)
    {
        $(".create-todo").show();
        $(".login").hide();
    }
    else
    {
        $(".create-todo").hide();
        $(".login").show();
    }
}

function login(event)
{
    event.preventDefault();
    let email = $(".email").val();
    let password = $(".password").val();
    $(".email").val("");
    $(".password").val("");
    $.ajax(
    {
        type: "POST",
        url: baseUrl + "user/login",
        data: {email, password}
    })
    .done(data => 
    {
        localStorage.setItem("accessToken", data.accessToken);
        authentication();
    })
    .fail(err => console.log("error", err));
}

function register(event)
{
    event.preventDefault();
    let email = $(".email").val();
    let password = $(".password").val();

    $.ajax(
    {
        type: "POST",
        url: baseUrl + "user/register",
        data: {email, password}
    })
    .done(() =>
    {
        $(".register").hide();
        $(".login").show();
    })
    .fail(err => console.log("error", err));
}

function createTodo(event)
{
    event.preventDefault();
    let title = $("#title").val();
    let description = $("#description").val();
    let due_date = $("#due_date").val();

    $.ajax(
    {
        type: "POST",
        url: baseUrl + "todos",
        data: {title, description, due_date},
        headers : {usertoken : localStorage.accessToken}
    })
    .done((data) =>
    {
        // alert("Success create a Todo");
        console.log("Success create a Todo", data);
    })
    .fail(err => console.log("error", err));
}

function showTodo()
{
    $.ajax(
    {
        type: "GET",
        url: baseUrl + "todos",
        headers : {usertoken : localStorage.accessToken}
    })
    .done(data => 
    {
        for(let i in data)
        {
            let add =
            `<tr id="todo-${i}">
                <td>${data[i].id}</td>
                <td>${data[i].title}</td>
                <td>${data[i].description}</td>
                <td>${data[i].status}</td>
                <td>${data[i].due_date}</td>
                <td>
                    <button id="update-todo-${data[i].id}" class="btn btn-primary">Update Todo</button>
                    <button id="delete-todo-${data[i].id}" class="btn btn-primary">Delete Todo</button>
                </td>
            </tr>`;
            $(`#todo-${i}`).remove();
            $("#todo-table").append(add);
        }
    })
    .fail(err => console.log("error", err));
}