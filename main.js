let BASEURL = 'http://localhost:3000'
let project
let puser //project user
let todo
let user
let members

$(document).ready(function () {
    auth()
    // $('.logout').click(function () {
    //     localStorage.clear()
    //     auth()
    // })

})


function logout() {
    localStorage.clear()
    auth()
}


function toggleForm() {
    $('form').animate({
        height: "toggle",
        opacity: "toggle"
    }, "slow");
}


function auth() {
    if (localStorage.access_token) {
        $('.login-page').hide()
        $('.main-page').show()
        $('.invitation-page').hide()
        $('.todos-page').hide()
        // $('.update-page').hide()
        fetchProjects()

    } else {
        $('.login-page').show()
        $('.main-page').hide()
        $('.invitation-page').hide()
        $('.todos-page').hide()
        // $('.update-page').hide()
    }
}


function loginUser(event) {
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
            // console.log(err)


            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })
}


function registerUser(event) {
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
            swal({
                title: "REGISTER SUCCESS",
                text: "Please Login Now",
                icon: "success",
                button: "CLOSE"
            });
            auth()
        })
        .fail(err => {
            console.log("LOGIN ERROR");
            // console.log(err)


            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })
}


// AKU TAK BERANI MACAM2 SAMA NIH METHOD YG SATOE
function onSignIn(googleUser) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    // let profile = googleUser.getBasicProfile();
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
            console.log("LOGIN ERROR");
            // console.log(err)


            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })

}


function go2Upd() {
    $('.login-page').hide()
    $('.main-page').hide()
    $('.update-page').show()
}


function fetchProjects() {

    console.log("FETCH PROJECTS FROM CLIENT");
    $.ajax({
            method: 'GET',
            url: BASEURL + '/projects',
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(response => {
            $('.projectList').empty()
            for (let i = 0; i < response.data.length; i++) {

                puser = response.data[i]
                let title = puser.Project.title
                let projectid = puser.ProjectId
                members = puser.Project.Users


                $('.projectList').append(`
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">${title}</h4>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" onclick="showTodoTbl( ${projectid})" class="btn btn-info">Todos</button>
                                <button type="button" onclick="showMembers(${members})" class="btn btn-warning">Members</button>
                                <button type="button" onclick="inviteForm(${projectid})" class="btn btn-success">Invite</button>
                                <button type="button" onclick="updProjectForm(${projectid})" class="btn btn-secondary">Update</button>
                                <button type="button" onclick="dropProject(${projectid}, event)" class="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                `)
            }
        })
        .fail(err => {
            console.log("LOGIN ERROR");
            // console.log(err)


            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })

}


function createProject(event) {

    console.log("CLIENT: CREATE PROJECT");
    event.preventDefault()

    let projectname = $('#project-title').val()

    $.ajax({
            method: 'POST',
            url: BASEURL + '/projects',
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                title: projectname
            }
        })
        .done(response => {

            console.log("SUCCESS CREATE PROJECT");
            swal({
                title: "SUCCESS",
                text: "New Project Has Been Created",
                icon: "success",
                button: "CLOSE"
            })
            fetchProjects()

        })
        .fail(err => {
            console.log("CREATE PROJECT ERROR");
            // console.log(err)

            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })

}


function convertDate(input) {


    let dd = new Date(input).getDate()
    let mm = new Date(input).getMonth() + 1
    let yyyy = new Date(input).getFullYear()

    if(dd < 10) {
        dd = '0'+dd
    }

    if(mm < 10) {
         mm = '0'+mm
    }

    let parsdDate = yyyy+"-"+mm+"-"+dd

    return parsdDate

}

function showTodoTbl(projectid) {

    console.log("SHOWING TODOS OF CORRESPONDING PROJECTS");
    $('.invitation-page').hide()
    $('.main-page').hide()
    $('.todos-page').show()

    $('.todos-list').empty()
    $('#projectid-addform').val(projectid)
    // $('#projectname-addform').val(projectname)

    $.ajax({
            method: 'GET',
            url: BASEURL + '/projects/' + projectid + '/todos',
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(response => {

            console.log("DONE FETCHING TODOS");
            let todolist = response.data
            console.log(todolist);
            $('#projectname-addform').val(todolist[0]['Project']['title'])
            for (let i = 0; i < todolist.length; i++) {
                let todo = todolist[i]
                let todoDue = todo['due_date']
                let todoDueConverted = convertDate(todoDue)

                $('.todos-list').append(`
                    <br>
                    <div class="card" style="width: 18rem;">
                        <div class="card-header">
                            ${todo.title}
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">${todo.description}</li>
                            <li class="list-group-item">${todo.status}</li>
                            <li class="list-group-item">${todoDueConverted}</li>
                        </ul>
                    </div>
                    <br>
                `)
            }

        })
        .fail(err => {
            console.log("LOGIN ERROR");
            // console.log(err)


            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })



}


function inviteForm(projectid) {

    console.log("ENTERING INVITATION FORM PAGE");
    $('.invitation-page').show()
    $('.main-page').hide()
    $('.todos-page').hide()

    $('#projectid-invite').val(projectid)

}


function inviteMember(event) {

    event.preventDefault()

    console.log("WE'RE NOW INVITING MEMBER FOR PROJECT");

    $.ajax({
            method: 'POST',
            url: BASEURL + '/projects/invite',
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                email: $('#invitiation-email').val(),
                projectId: +$('#projectid-invite').val()
            }
        })
        .done(response => {
            console.log("MEMBER INVITED!");
            swal({
                title: "MEMBER INVITED",
                text: "Please go back to Home",
                icon: "success",
                button: "CLOSE"
            })
            fetchProjects()
        })
        .fail(err => {
            console.log("INVITE MEMBER ERROR");
            // console.log(err)

            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })

}


function dropProject(projectid, event) {

    event.preventDefault()

    console.log("WE ARE ABOUT TO DELETE A PROJECT");


    $.ajax({
            method: 'DELETE',
            url: BASEURL + '/projects/' + projectid,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(response => {

            console.log("PROJECT DELETED!");
            swal({
                title: "DELETE SUCCESS",
                text: "Please go back to Home",
                icon: "success",
                button: "CLOSE"
            })
            fetchProjects()


        })
        .fail(err => {
            console.log("CREATE PROJECT ERROR");
            // console.log(err)

            let arr = err.responseJSON.errors
            let code = err.status
            let type = err.statusText

            let codetype = code + " " + type
            arr.forEach(el => {
                swal({
                    title: codetype,
                    text: el,
                    icon: "error",
                    button: "CLOSE"
                });
            })

        })


}