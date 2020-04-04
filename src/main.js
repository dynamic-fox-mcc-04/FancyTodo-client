let BASEURL = 'https://maxhamz-fancy-todo-r.herokuapp.com'
let isLoading = true
let project
let puser //project user
let todo
let user
let status
let members
let member
let projectid
let todoID
let title
let due
let desc
let url2send
let arrParams

// $(window).load(function() {
    
// });

// $(".lds-dual-ring").show()

$(document).ready(function () {
    
    auth()
    // $(".lds-dual-ring").fadeOut("slow");
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
        $('.todos-page').hide()
        $('.update-page').hide()
        $('.invitation-page').hide()
        $('.showmembers-page').hide()
        $('.lds-dual-ring').hide()

        
        fetchProjects()

    } else {
        $('.login-page').show()
        $('.main-page').hide()
        $('.todos-page').hide()
        $('.update-page').hide()
        $('.invitation-page').hide()
        $('.showmembers-page').hide()
        $('.lds-dual-ring').hide()
    }
}


function loginUser(event) {

    event.preventDefault()
    isLoading = true
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

/*
------------------------------
 PROJECTS RELATED
------------------------------ 
 */

function inviteForm(projectid) {

    console.log("ENTERING INVITATION FORM PAGE");

    $('.main-page').hide()
    $('.todos-page').hide()
    $('.update-page').hide()
    $('.showmembers-page').hide()
    $('.invitation-page').show()


    $('#projectid-invite').val(projectid)
    let invite_projectid = $('#projectid-invite').val()
    console.log("THIS IS THE ONE WE;RE GONNA INVITE TO");
    console.log(invite_projectid);

    $.ajax({
            method: "GET",
            url: BASEURL + '/projects/' + invite_projectid,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(response => {

            console.log(`edit target found:`);
            console.log(response);
            console.log(`edit target's first inner layer is`);
            console.log(response.data);
            let datum = response.data

            console.log("FINAL CHECK");
            console.log(datum);
            title = datum.title

            return $('#project-name-invitation').val(title)



        })
        .fail(err => {
            console.log("FETCH PROJECT PARAM ERROR");
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


function showMembers(projectid) {

    console.log("SHOWING PROJECT MEMBERS OF THE PROJECT");
    $('.login-page').hide()
    $('.main-page').hide()
    $('.todos-page').hide()
    $('.update-page').hide()
    $('.invitation-page').hide()
    $('.showmembers-page').show()

    $('#showmembers-projectid').val(projectid)

    projectid = $('#showmembers-projectid').val()

    console.log("WE'RE VIEWING MEMBERS FOR PROJECT #");
    console.log(projectid);

    $.ajax({
            method: 'GET',
            url: BASEURL + '/projects/' + projectid,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(response => {

            $('#project-members').empty()
            console.log(response);
            title = response.data.title
            $('#showmembers-projectname').empty()
            $('#showmembers-projectname').append(`<h2> PROJECT ${title} </h2>`)
            members = response.data.Users
            console.log(members);
            for (let i = 0; i < members.length; i++) {

                member = members[i]

                let locar = member.location.split(";")
                let lat = locar[0]
                let lon = locar[1]

                $('#project-members').append(`
                <div class="card">
                    <div class="card-body">
                    <h4 class="card-title">EMAIL: ${member['email']}</h4>
                    <h5 class="card-title">LOCATION [LAT, LON]: [${lat}, ${lon}]</h5>
                    </div>
                </div>
            `)

            }
        })
        .fail(err => {
            console.log("SHOW MEMBERS ERROR");
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


function fetchProjects() {

    console.log("FETCH PROJECTS FROM CLIENT");

    isLoading = true

    $.ajax({
            method: 'GET',
            url: BASEURL + '/projects',
            headers: {
                access_token: localStorage.access_token
            }
        })
        .always(response => {
           showLoaders()
        })
        .done(response => {

            hideLoaders()
            showMain()

            $('.projectList').empty()

            for (let i = 0; i < response.data.length; i++) {

                puser = response.data[i]
                title = puser.Project.title
                projectid = puser.ProjectId
                members = puser.Project.Users

                // let id_name = title + "-" + projectid

                // let arrpm = {
                //     id: projectid,
                //     title: title
                // }
                // let arr = JSON.stringify(arrpm)

                // console.log("WHAT'S ARR?");
                // console.log(arr);

                $('.projectList').append(`
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">${title}</h4>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" onclick="showTodoTbl( ${projectid})" class="btn btn-info">Todos</button>
                                <button type="button" onclick="showMembers(${projectid})" class="btn btn-warning">Members</button>
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


function updProjectForm(projectid) {

    console.log("ENTERING EDIT FORM FOR TODO");

    // arrParams = paramstring.split("-")

    $('.invitation-page').hide()
    $('.main-page').hide()
    $('.todos-page').hide()
    $('.update-page').show()

    projectid = Number(projectid)

    $('#form-edit-project-id').val(projectid)

    $.ajax({
            method: "GET",
            url: BASEURL + '/projects/' + projectid,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(response => {

            console.log(`edit target found:`);
            console.log(response);
            console.log(`edit target's first inner layer is`);
            console.log(response.data);
            let datum = response.data

            console.log("FINAL CHECK");
            console.log(datum);
            title = datum.title
            let chiefId = datum.UserId
            members = datum.Users
            let chief

            // FIND CHIEF'S EMAIL
            for (let i = 0; i < members.length; i++) {
                member = members[i]
                if (member['id'] === chiefId) {
                    chief = member;
                    break;
                }
            }


            // $("#edit-todo-id").val(datum.id)
            $("#form-edit-project-name").val(title)
            $("#form-edit-project-owner").val(chief['email'])


        })
        .fail(err => {
            console.log("FETCH PROJECT PARAM ERROR");
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


function editProject(event) {

    event.preventDefault()
    console.log("WE ARE ABOUT TO EDIT PROJECT");

    projectid = Number($('#form-edit-project-id').val())

    title = $("#form-edit-project-name").val()
    let newChief = $('#form-edit-project-owner').val()

    console.log("THE INPUT PARAMS ARE");
    console.log([projectid, title, newChief]);



    $.ajax({
            method: 'PUT',
            url: BASEURL + '/projects/' + projectid,
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                title: title,
                email: newChief
            }
        })
        .done(response => {

            console.log("SUCCESS UPDATE PROJECT");
            console.log(response)
            swal({
                title: "SUCCESS",
                text: "Project Updated",
                icon: "success",
                button: "CLOSE"
            })

            fetchProjects()
            showTodoTbl(projectid)

            // $('.login-page').hide()
            // $('.main-page').show()
            // $('.invitation-page').hide()
            // $('.todos-page').hide()
            // $('.update-page').hide()

        })
        .fail(err => {
            console.log("EDIT PROJECT ERROR");
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
            console.log("EDIT PROJECT ERROR");
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


/*
------------------------------
 TODOS RELATED
------------------------------ 
 */


function convertDate(input) {


    let dd = new Date(input).getDate()
    let mm = new Date(input).getMonth() + 1
    let yyyy = new Date(input).getFullYear()

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    let parsdDate = yyyy + "-" + mm + "-" + dd

    return parsdDate

}


function showTodoTbl(projectid) {

    console.log("SHOWING TODOS OF CORRESPONDING PROJECTS");

    // let dcd = JSON.parse(projectparams)
    // console.log("what's the real array?");
    // console.log(dcd);

    $('.invitation-page').hide()
    $('.main-page').hide()
    $('.todos-page').show()
    $('#pg-edit-todo-form').hide()

    $('.todos-list').empty()

    $('#projectid-addform').val(projectid)
    // $('#projectname-addform').val(dcd['title'])


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

            if(todolist.length > 0) {
                $('#projectname-addform').val(todolist[0]['Project']['title'])
                $('#projectname-addform').show()
            } else {
                $('#projectname-addform').hide()
            }
           
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
                            <li class="list-group-item">
                                <button type="button" onclick="formEditTodo(${todo.id})" 
                                    class="btn btn-warning">EDIT</button>
                                <button type="button" onclick="dropTodo(${todo.id}, event)" 
                                    class="btn btn-danger">DELETE</button>
                            </li>
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


function addTodo(event) {

    event.preventDefault()
    console.log("WE ARE ABOUT TO ADD NEW TODO");

    projectid = Number($('#projectid-addform').val())
    title = $('#add-todo-title').val()
    desc = $('#add-todo-desc').val()
    due = $('#add-todo-due').val()

    console.log("THE INPUT PARAMS ARE");
    console.log([projectid, title, desc, due]);



    $.ajax({
            method: 'POST',
            url: BASEURL + '/projects/' + projectid + '/todos',
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                title: title,
                description: desc,
                due_date: due
            }
        })
        .done(response => {

            console.log("SUCCESS CREATE TODO");
            console.log(response)
            swal({
                title: "SUCCESS",
                text: "New Todo Has Been Created",
                icon: "success",
                button: "CLOSE"
            })

            showTodoTbl(projectid)

        })
        .fail(err => {
            console.log("CREATE TODO ERROR");
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


function formEditTodo(todoid) {

    console.log("ENTERING EDIT FORM FOR TODO");

    $('#pg-form-add-todo').hide()
    $('.todos-list').hide()
    $('#pg-edit-todo-form').show()

    projectid = Number($('#projectid-addform').val())
    todoID = todoid

    $.ajax({
            method: "GET",
            url: BASEURL + '/projects/' + projectid + '/todos/' + todoid,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        }).done(response => {

            console.log(`edit target found:`);
            console.log(response);
            console.log(`edit target's first inner layer is`);
            console.log(response.data);
            let datum = response.data

            console.log("FINAL CHECK");
            console.log(datum);
            let prostatus = datum.status
            due = datum.due_date

            // $("#edit-todo-id").val(datum.id)
            $("#edit-todo-title").val(datum.title)
            $("#edit-todo-desc").val(datum.description)

            // SHOW STATUS GIMANA YAK?
            //     $("#edit-todo-status").append(`
            //     value="${prostatus}" selected
            // `)

            $("#edit-todo-status").val(prostatus)

            let parsdDate = convertDate(due)
            $("#edit-todo-due").val(parsdDate)

            // editTodo(id, event)

        })
        .fail(err => {
            console.log("CREATE TODO ERROR");
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


function editTodo(event) {

    event.preventDefault()
    console.log("WE ARE ABOUT TO ADD NEW TODO");

    projectid = Number($('#projectid-addform').val())

    title = $("#edit-todo-title").val()
    desc = $('#edit-todo-desc').val()
    due = $('#edit-todo-due').val()
    status = $('#edit-todo-status').val()

    console.log("THE INPUT PARAMS ARE");
    console.log([projectid, title, desc, due, status, todoID]);



    $.ajax({
            method: 'PUT',
            url: BASEURL + '/projects/' + projectid + '/todos/' + todoID,
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                title: title,
                description: desc,
                status: status,
                due_date: due
            }
        })
        .done(response => {

            console.log("SUCCESS UPDATE TODO");
            console.log(response)
            swal({
                title: "SUCCESS",
                text: "Todo Updated",
                icon: "success",
                button: "CLOSE"
            })

            showTodoTbl(projectid)

            $('#pg-form-add-todo').show()
            $('.todos-list').show()
            $('#pg-edit-todo-form').hide()


        })
        .fail(err => {
            console.log("CREATE TODO ERROR");
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


function dropTodo(todoid, event) {

    event.preventDefault()
    console.log("WE ARE ABOUT TO ADD NEW TODO");

    projectid = Number($('#projectid-addform').val())

    console.log("THE INPUT PARAMS ARE");
    console.log([projectid, title, desc, due]);



    $.ajax({
            method: 'DELETE',
            url: BASEURL + '/projects/' + projectid + '/todos/' + todoid,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(response => {

            console.log("SUCCESS DELETE TODO");
            console.log(response)
            swal({
                title: "SUCCESS",
                text: "Todo Has Been Deleted",
                icon: "success",
                button: "CLOSE"
            })

            showTodoTbl(projectid)

            $('#pg-form-add-todo').show()
            $('.todos-list').show()
            $('#pg-edit-todo-form').hide()

        })
        .fail(err => {
            console.log("CREATE TODO ERROR");
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


function showLoaders() {
    $('.lds-dual-ring').show()

    $('.login-page').hide()
    $('.main-page').hide()
    $('.todos-page').hide()
    $('.invitation-page').hide()
    $('.showmembers-page').hide()
    $('.update-page').hide()

}


function hideLoaders() {

        $('.lds-dual-ring').hide()
        $('.login-page').hide()
        $('.main-page').hide()
        $('.todos-page').hide()
        $('.invitation-page').hide()
        $('.showmembers-page').hide()
        $('.update-page').hide()

}

