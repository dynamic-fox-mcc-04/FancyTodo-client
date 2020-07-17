let baseUrl = "http://localhost:3000/";

$(document).ready(function()
{
    authentication();
    $("a").click(event => event.preventDefault());
    $(".register").hide();

    $("#toRegister").click(function( event ) {
        $(".register").show();
        $(".login").hide();
    });

    $("#toLogIn").click(function( event ) {
        $(".register").hide();
        $(".login").show();
    });

    $("#to-create-todo").click(function( event ) {
        $(".show-todo").hide();
        $(".create-todo").show();
    });

    $("#logout").click(function( event ) {
        localStorage.removeItem("accessToken");
        authentication();
    });
});

function authentication()
{
    $(".show-todo").hide();
    if(localStorage.accessToken)
    {
        weather();
        $("#logout").show();
        $("#toShowTodo").show();
        showTodo();
        $(".login").hide();
    }
    else
    {
        $("#airvisual-city").text(``);
        $("#airvisual").text(``);
        $("#logout").hide();
        $("#toShowTodo").hide();
        $(".create-todo").hide();
        $(".update-todo").hide();
        $(".login").show();
    }
}

function login(event)
{
    event.preventDefault();
    let email = $("#email-login").val();
    let password = $("#password-login").val();
    $("#email-login").val("");
    $("#password-login").val("");
    $.ajax(
    {
        type: "POST",
        url: baseUrl + "login",
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
    let email = $("#email-register").val();
    let password = $("#password-register").val();

    $.ajax(
    {
        type: "POST",
        url: baseUrl + "register",
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
    let title = $("#title-create").val();
    let description = $("#description-create").val();
    let due_date = $("#due_date-create").val();

    $.ajax(
    {
        type: "POST",
        url: baseUrl + "todos",
        data: {title, description, due_date},
        headers : {usertoken : localStorage.accessToken}
    })
    .done((data) =>
    {
        $("#title-create").val("");
        $("#description-create").val("");
        $("#due_date-create").val("");

        console.log("Success create a Todo", data);
        authentication();
    })
    .fail(err => 
    {
        console.log("error", err)
    });
}

function showTodo()
{
    $(".create-todo").hide();
    $(".update-todo").hide();
    $(".show-todo").show();
    
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
            if(!data[i].status)
                data[i].status = "Pending";
            else
            data[i].status = "Done";
            let add =
            `<tr id="todo-${data[i].id}">
                <td nowrap>${data[i].id}</td>
                <td nowrap>${data[i].title}</td>
                <td nowrap>${data[i].description}</td>
                <td nowrap>${data[i].status}</td>
                <td nowrap>${data[i].due_date}</td>
                <td nowrap>
                    <button onclick="showUpdate(${data[i].id})" class="btn btn-primary">Update</button>
                    <button onclick="deleteTodo(${data[i].id})" class="btn btn-primary">Delete</button>
                </td>
            </tr>`;

            $(`#todo-${data[i].id}`).remove();
            $("#todo-table").append(add);
        }
    })
    .fail(err => console.log("error", err));
}

function deleteTodo(id)
{
    $.ajax(
    {
        type: "DELETE",
        url: baseUrl + `todos/${id}`,
        headers : {usertoken : localStorage.accessToken}
    })
    .done(() => 
    {
        $(`#todo-${id}`).remove();
        authentication();
    })
    .fail(err => console.log(err));
}

function showUpdate(id)
{
    $.ajax(
    {
        type: "GET",
        url: baseUrl + `todos/${id}`,
        headers : {usertoken : localStorage.accessToken}
    })
    .done(data =>
    {
        $("#title-update").val(data.title);
        $("#description-update").val(data.description);
        $("#due_date-update").val(data.due_date);
        if(data.status)
        {
            $(`#status-update option[value='true']`).attr("selected", true);
            $(`#status-update option[value='false']`).attr("selected", false);
        }
        else
        {
            $(`#status-update option[value='true']`).attr("selected", false);
            $(`#status-update option[value='false']`).attr("selected", true);
        }
        $("#id-update").val(id);
        $(".show-todo").hide();
        $(".update-todo").show();
    })
}

function updateTodo(event)
{
    event.preventDefault();
    let id = $("#id-update").val();
    $.ajax(
    {
        type: "PUT",
        url: baseUrl + `todos/${id}`,
        headers : {usertoken : localStorage.accessToken},
        data  :
        {
            title : $("#title-update").val(), 
            description : $("#description-update").val(), 
            due_date : $("#due_date-update").val(),
            status : $("#status-update").val()
        }
    })
    .done(() => 
    {
        authentication();
    })
    .fail(err => console.log(err));
}