const baseUrl = 'http://localhost:3000'

$( document ).ready(function () {
      authentication()
      $('.error').hide()
      $('#logout').click(function () {
            localStorage.clear()
            sessionStorage.clear()
            signOut()
            authentication()
      })

      $('#due_date').datepicker({
        uiLibrary: 'bootstrap4'
      });

      $('#new_due_date').datepicker(new Date())
})



function getQuote(){
   
    $.ajax({
        method : 'GET',
        url : baseUrl + '/api/quote'
    })
    .done(result => {
        loading()
        $('h3').empty()
        $('#content').append(`${result.content}`)
        $(`#author`).append(`${result.author}`)
    })
    .fail(err => {
        console.log(err);
        
    })
    .always(() => {
        unLoading()
    })
}

function getWallpaper(){
   
    $.ajax({
        method : 'GET',
        url : baseUrl + '/api/wallpaper'
    })
    .done(result => {
        loading()
        $('.todoList').css('background-image' , `url('${result.url}')`)
        $('.header')
        
    })
    .fail(err => {
        console.log(err);
        
    })
    .always(() => {
        unLoading()
    })
}

function getDay(){
 
    $.ajax({
        method:'GET',
        url : baseUrl + '/api/holiday',
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(data => {
        
        loading();
        $('#day').empty();
        $('#day').append(`Happy ${data.day} !`)

    })
    .fail(error => {
        console.log(err);
    })
    .always(() => {
        unLoading()
    })

}



function signup(event){

    event.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
    let email = $('#email').val()
 
    $.ajax({
        method : 'POST',
        url : baseUrl + '/user/signup',
        data : {
            username,
            password,
            email
        }
    })
    .done(result => {
        successLoading();
    })
    .fail(err => {
        getErrors(err)
    })
    .always(() => {

        setTimeout(()=>{
            unLoading()
        },2000)
      
    })
}


function loading() {

    $('#loading').empty()
    $('#loading').append(`
        <lottie-player
             src="https://assets8.lottiefiles.com/packages/lf20_mSrOM1.json" background="transparent"  speed="1"  style="width: 200px; height: 200px;"  loop autoplay >
        </lottie-player>
    `)
    $('body > *:not(#loading)').css('filter','blur(2px)')
   
}

function unLoading() {

    $('#loading').empty()
    $('body > *:not(#loading)').css('filter','blur(0)')
    
}

function successLoading() {

    $('#loading').empty()
    $('#loading').append(`
        <lottie-player
             src="https://assets8.lottiefiles.com/packages/lf20_N7Lsmq.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  autoplay>
        </lottie-player>
    `)
    $('body > *:not(#loading)').css('filter','blur(2px)')
}


function signin(event){
   
    event.preventDefault()
    let username = $('#user').val();
    let password = $('#pass').val();

    
    $.ajax({
        method : 'POST',
        url : baseUrl + '/user/signin',
        data : {
            username,
            password
        }
    })
    .done(result => {
        localStorage.setItem('access_token', result.access_token)
        authentication()
    })
    .fail(err => {

        getErrors(err)

    })
    .always(() => {
        unLoading()
    })

}

function authentication(){
    if (localStorage.access_token){
        loading()
        $('.login-wrap').hide()
        $('.main-page-warp').show()
        getQuote()
        getDay()
        getTodos()
        getWallpaper()
        
    } else {
        $('.login-wrap').show()
        $('.main-page-warp').hide()
        $('.todoList').empty()
    }

}

function getTodos() {

    loading()
    $.ajax({
        method:'GET',
        url : baseUrl + '/todos',
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(result => {
        
        $('.todoList').empty()
        $('#userName').empty()
        $('#userName').append(`Hai, <b>${result.username}</b>`)

        result.todos.forEach(el => {
            let date    = new Date(el.due_date)
            let r_month = (date.getMonth() * 1) + 1

            let year     = date.getFullYear()
            let month   = r_month < 10 ? '0' + r_month : r_month
            let day     = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate()
            let newDate = month + '/' + day + '/' + year;
            
            let status = (el.status.toLowerCase() == 'on progress') ? 'text-warning' : 'text-success'

            $('.todoList').append(`
           <div class="card" style="width: 18rem;">
             <div class="card-body">
                <h5 class="card-title">${el.title}</h5>
                <p class="card-text">${el.description}</p>
                <p class="text-secondary">Due date : ${newDate}</p>
                <p class=${status}>${el.status}</p>
                <button type="button" class="btn btn-primary btn-sm" onclick="updateBtn(${el.id})" data-toggle="modal" data-target="#update-task")">Update</button>
                <button type="button" class="btn btn-danger btn-sm"  onclick="deleteBtn(${el.id})">Delete</button>
                <button type="button" class="btn btn-success btn-sm"  onclick="invite(${el.id})">+invite</button>
            </div>
            </div>
            `)     
        });

    })
    .fail(error => {
        console.log(err);
    })
    .always(() =>{
        unLoading()
    })
    
}

function invite(Taskid) {
    
    $('.invite').empty()

    $.ajax({
        method : 'GET',
        url : baseUrl + '/user'
    })
    .done(result => {
       


        result.users.forEach(el => {
            

        });
        
    })
    .fail(err =>{
        console.log(err);
        
    })


}

function updateBtn(id){
    
    
    $.ajax({
        method:'GET',
        url : baseUrl + '/todos/' + id,
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(result => {
       
        $('.button-update').empty()
        let date    = new Date(result.todos.due_date)
        let r_month = (date.getMonth() * 1) + 1

        let year     = date.getFullYear()
        let month   = r_month < 10 ? '0' + r_month : r_month
        let day     = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate()
        let newDate = month + '/' + day + '/' + year;

        $('#newtitle').val(result.todos.title)
        $('#newdescription').val(result.todos.description)
        $('#new_due_date').val(newDate)
        $('#newstatus').val(result.todos.status)

        $('.button-update').append(
            `<button type="submit" class="btn btn-primary" data-dismiss = "modal" onclick="update(${result.todos.id})">Save </button>`
        )
    })
    .fail(err => {
        console.log(err);
    })
}

function update(id){
    
    let title = $('#newtitle').val()
    let description = $('#newdescription').val()
    let due_date = $('#new_due_date').val()
    let status = $('#newstatus').val()

    $.ajax({
        method:'PUT',
        url : baseUrl + '/todos/' + id,
        data : {
            title,
            description,
            due_date,
            status
        },
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(result => {
        getTodos()
    })
    .fail(err => {
        getErrors(err)  
    })
}

function create(event) {
    event.preventDefault();
    
    let title = $('#title').val();
    let description = $('#description').val();
    let due_date = $('#due_date').val();
    let status = $('#status').val();
    
    $.ajax({
        method : 'POST',
        url : baseUrl + '/todos',
        data : {
            title,
            description,
            due_date,
            status
        },
        headers : {
            access_token : localStorage.access_token
        },
       
    })
    .done(result => {
        getTodos()
    })
    .fail(err => {
        getErrors(err)
    })
}


function deleteBtn(id){
    $.ajax({
        method : 'DELETE',
        url : baseUrl + '/todos/' + id,
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(result => {
        getTodos()       
    })
    .fail(err => {
        console.log('failed');
        
    })

}

//google Oauth2
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method : 'POST',
        url : baseUrl + '/user/googleSign',
        data : {
            id_token
        }
    })
    .done(result => {
        localStorage.setItem('access_token', result.access_token)
        authentication()
    })
    .fail(err => {
        console.log(err);
        
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  function getErrors(err){

    let obj = jQuery.parseJSON( err.responseText);

    $('.error').empty();
    obj.errors.forEach(el=>{
        
        $('.error').append(`
            ${ el.message }
            <br>
        `)
    })
    
    setTimeout(() => {
        $('.error').hide()
    }, 3000)
    $('.error').show()
  }