let baseUrl = 'http://localhost:3000'

$(document).ready(() => {
    // alert('welcome')
    $('#add-todo').click(function () {
        $('#modal-create , #bg').fadeIn("slow");
    });
    $('#tombol-tutup').click(function () {

        $('#modal-create , #bg').fadeOut("slow");
    });

    $('#tombol-tutup-update').click(function () {
        $('#modal-update , #bg').fadeOut("slow");
    });
    auth()
})

function reportCorona(){
    $.ajax({
        method: 'GET',
        url: baseUrl + '/api/getCovidReportAll',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('#dataCorona').empty()
            console.log(data);
            const cases = data.data.cases
            const recovered = data.data.recovered
            const death = data.data.deaths
            $('#dataCorona').append(
               `<div class="column" style="background-color: rgb(223, 100, 0);color: whitesmoke;">
                    <p class="bd-notification is-info">Cases</p>
                    <label>${cases}</label>
                    <br>
                    <br>
                    <div class="columns is-mobile">
                        <div class="column" style="background-color: rgb(230, 0, 0);color: whitesmoke;">
                        <p class="bd-notification is-info">Deaths</p>
                        <label>${death}</label>
                        </div>
                        <div class="column" style="background-color: green;color: whitesmoke;">
                        <p class="bd-notification is-info">Recovered</p>
                        <label>${recovered}</label>
                        </div>
                    </div>
                </div>`
            )
        })
        .fail(data => {
            console.log(data)
        })
}

function signout() {
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:none !important');
    localStorage.clear()
    $('#bg').fadeOut("slow");
    auth()
}

function auth() {
    if (localStorage.token) {
        $('#Form-Login').attr('style', 'display:none !important');
        $('#Form-SignUp').attr('style', 'display:none !important');
        $('#Todo-List').attr('style', 'display:grid !important');
        fetchData()
        reportCorona()
    } else {
        $('#Form-Login').attr('style', 'display:table !important ; margin-top:100px !important');
        $('#Todo-List').attr('style', 'display:none !important');
    }
}

function modalDaftar(){
    $('#Form-SignUp').attr('style', 'display:table !important; margin-top: 100px !important;');
    $('#Form-Login').attr('style', 'display:none !important');
}

function modalMasuk(){
    $('#Form-SignUp').attr('style', 'display:none !important; margin-top: 100px !important;');
    $('#Form-Login').attr('style', 'display:table !important; margin-top: 100px !important;');
}

function signup(event) {
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:table !important; display: flex !important;justify-content: center !important; align-items: center !important;');
    event.preventDefault()
    const email = $('#email-daftar').val()
    const password = $('#password-daftar').val()
    console.log(email, password);
    
    $.ajax({
        method: 'POST',
        url: baseUrl + '/signup',
        data: {
            email,
            password
        }
    })
        .done(data => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            console.log(err)
        })
}

function signin(event) {
    event.preventDefault()
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:table !important; display: flex !important;justify-content: center !important; align-items: center !important;');
    const email = $('#email').val()
    const password = $('#password').val()
    $.ajax({
        method: 'POST',
        url: baseUrl + '/signin',
        data: {
            email,
            password
        }
    })
        .done(data => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            console.log(err)
        })
}

function fetchData() {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todo',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('.data-item').empty()
            console.log(data);
            for (let i in data) {
                const id = data[i].id
                const title = data[i].title
                const description = data[i].description
                const date = new Date(data[i].due_date).toDateString()
                const status = data[i].status
                const email = data[i].User.email

                $('.data-item').append(
                    `
                <div class="column is-half">
                    <div class="box"  >
                        <div style="display: flex;justify-content: flex-end;">
                            <a onclick="deleteTodo(${id})" class="delete"></a>
                        </div>
                        <article class="media" style="cursor:pointer;" onclick="findById(${id})">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="content">
                                <p>
                                    <strong>${title}</strong> <small>${email}</small> <small>${date}</small>
                                    <br>
                                    ${description}
                                </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                `
                )
            }
        })
        .fail(data => {
            console.log(data)
        })
}

function createTodo(event) {
    event.preventDefault()
    const title = $('#title').val()
    const description = $('#description').val()
    const due_date = $('#due-date').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/todo',
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            auth()
            $('#modal-create , #bg').fadeOut("slow");
        })
        .fail(err => {
            console.log(err)
        })
}

function findById(id) {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todo/' + id,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {

            let date = new Date(data.due_date)
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }

            const newDate = date.getFullYear() + "-" + month + "-" + day
            $('#id-update').val(data.id)
            $('#title-update').val(data.title)
            $('#description-update').val(data.description)
            $('#due-date-update').val(newDate)
            $('#modal-update , #bg').fadeIn("slow");
        })
        .fail(err => {
            console.log(err)
        })
}

function updateTodo(event) {
    event.preventDefault()
    const title = $('#title-update').val()
    const description = $('#description-update').val()
    const due_date = $('#due-date-update').val()
    $.ajax({
        method: 'PUT',
        url: baseUrl + '/todo/' + $('#id-update').val(),
        headers: {
            token: localStorage.token
        }, data: {
            title,
            description,
            due_date
        }
    })
        .done(data => {
            auth()
            $('#modal-update , #bg').fadeOut("slow");
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: baseUrl + '/todo/' + id,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            auth()
        })
        .fail(err => {
            console.log(err)
        })
}