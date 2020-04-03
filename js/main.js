let urlmaster ='http://localhost:3000'
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
$(document).ready(function(event){
    
    $('.createForm').hide()
    $('.editForm').hide()
    $('#registerForm').hide()
    $('#forgotform').hide()
    authentication()
    $.ajax({
        method:"GET",
        url:urlmaster +'/apiquotes'
    })
   
    
    .then(quote=>{
        console.log(quote);
        
        $('#msg_quotes').html("'"+quote.quotes.quoteText+"'")
    })
    .catch(err=>{
        console.log(err);
        
    })
  
    
    event.preventDefault;
})


function createUser(event){
    
    let signup_email = $('#signup_email').val()
    let signup_pass = $('#signup_pass').val()
    let signup_pass2 = $('#signup_pass2').val()
    if(signup_pass==signup_pass2){
        $.ajax({
            method :'POST',
            url: urlmaster +'/user/register',        
            data:{
                email: signup_email,
                password: signup_pass
            }
        })
        .done(result=>{
            // $('.createForm').hide()
            $('#registerForm').hide()
            $('#registerForm').hide()
            $('#todocontent').show()
            viewtodo()
            toastr["info"]("WELCOME TO TODO APPS", "SELAMAT")  
        })
        .fail(err=>{                        
            let bacaError =err.responseJSON.error.errors.map(el=>el.message).join(",")            
            $('#msg_signup').html(bacaError)
            toastr["warning"](bacaError, "Message")  
        })
    } else {
        console.log("salah");
        
        $('#msg_signup').html("Password tidak sama")
    }
    event.preventDefault()
}

function login(event){
    event.preventDefault();
    let email = $('#email').val()
    let password =$('#pass').val()
    $.ajax({
        method:'POST',
        url:urlmaster +'/user/login',
        data:{
           email: email,
           password: password
        }
    })
    .done(data=>{
        //masukan token ke dalam localstorage client
        localStorage.setItem('token',data.Data.token)
        localStorage.setItem('email',data.Data.email)
        authentication()
        
        

    })
    .fail(err=>{
        console.log(err)
        let bacaError =err.responseJSON.msg          
        $('#msg_limiter').html(bacaError)
        toastr["warning"](bacaError, "Message")  
    })


}
function authentication(){
    if(localStorage.token){        
        $('.limiter').hide()
        $('#todocontent').show()
        viewtodo()        
    } else {
        $('.limiter').show()
        $('#todocontent').hide()
    }
}

function viewtodo(){
     
    $('.row').empty()
    $.ajax({
        method:'GET',
        url:urlmaster+'/todos',
        headers:{
            token:localStorage.token,
            status:false
        }
    })
    .done(result=>{
        for( let i in result.todos){
            let {id,
            title,
            description,
            status,
            due_date,
            UserId,
            createdAt,
            updatedAt} = result.todos[i]
            
            let color = random_color();
            let color2 = random_color();

         $('.row').append (`
         <div class="col-md-4 card-container" style="background-color:${color}">
         <div class="card-flip">
           <!-- Card 1 Front -->
           <div class="card front"  style="background-color:${color2}">
             <span class="fa fa-4x fa-smile-o text-center"></span>
             <div class="card-block">
               <h4 class="card-title text-center">${title}</h4>
               <h6 class="card-subtitle mb-2 text-muted text-center">${id}</h6>
               <p class="card-text">${description}</p>
             </div>
           </div>
           <!-- End Card 1 Front -->
   
           <!-- Card 1 Back -->
           <div class="card back" style="background-color:${color2}">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    
                    <li class="nav-item">
                        <button onclick ="updateForm('${id}','${title}','${description}','${formatDateEdit(due_date)}')" class="nav-link" >Edit</button>
                    </li>
                    <li class="nav-item">
                    <button onclick ="del(${id})" class="nav-link" >Delete</button>
                    </li>
                  </ul>
                </div>
                <div class="card-block">
                  
                  <p class="card-text">Due Date: ${formatDate(due_date)}</p>
                  <p class="card-text">Create Date:${formatDate(createdAt)}</p>
                  <p class="card-text">Updated Date:${formatDate(updatedAt)}</p>
                  <button onclick="updateStatus(${id})" class="btn btn-primary">Done</button>
                </div>
              </div>
           <!-- End Card 1 Back -->
         </div>
       </div>
         `)  
        }
    })
    .fail(err=>{
        console.log(err)        
    })    

    
}


function viewtodo_done(){
    
    $('.row').empty()
    $.ajax({
        method:'GET',
        url:urlmaster+'/todos',
        headers:{
            token:localStorage.token,
            status:true
        }
    })
    .done(result=>{
        for( let i in result.todos){
            let {id,
            title,
            description,
            status,
            due_date,
            UserId,
            createdAt,
            updatedAt} = result.todos[i]
        let color = random_color();
        let color2 = random_color();
            
         $('.row').append (`
         <div class="col-md-4 card-container" style="background-color:${color}">
         <div class="card-flip">
           <!-- Card 1 Front -->
           <div class="card front" style="background-color:${color2}">
             <span class="fa fa-4x fa-smile-o text-center"></span>
             <div class="card-block">
               <h4 class="card-title text-center">${title}</h4>
               <h6 class="card-subtitle mb-2 text-muted text-center">${id}</h6>
               <p class="card-text">${description}</p>
             </div>
           </div>
           <!-- End Card 1 Front -->
   
           <!-- Card 1 Back -->
           <div class="card back" style="background-color:${color2}">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    
                    <li class="nav-item">
                        <button onclick ="updateForm('${id}','${title}','${description}','${formatDateEdit(due_date)}')" class="nav-link" >Edit</button>
                    </li>
                    <li class="nav-item">
                    <button onclick ="del(${id})" class="nav-link" >Delete</button>
                    </li>
                  </ul>
                </div>
                <div class="card-block">                  
                  <p class="card-text">Due Date: ${formatDate(due_date)}</p>
                  <p class="card-text">Create Date:${formatDate(createdAt)}</p>
                  <p class="card-text">Updated Date:${formatDate(updatedAt)}</p>                  
                </div>
              </div>
           <!-- End Card 1 Back -->
         </div>
       </div>
         `)  
        }
    })
    .fail(err=>{
        console.log(err)        
    })    

    
}




function random_color() {
    var color;
    color = "#" + Math.random().toString(16).slice(2, 8).toUpperCase();
    return color;
  }

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month,year ].join('-');
}
function formatDateEdit(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    // return [year,month,day].join('-');
    return year +"-"+month+"-"+day ;
}
function createTodo(event){
    event.preventDefault()
    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#duedate').val()
    let status = 'false'
    $.ajax({
        method :'POST',
        url: urlmaster +'/todos',
        headers:{
            token: localStorage.token
        },
        data:{
            title,
            description,
            due_date,
            status
        }
    })
    .done(result=>{
        $('.createForm').hide()
        authentication()        
        toastr["success"]("anda telah berhasil menambahkan todo", "Add todo ")    
    })
    .fail(err=>{

        let bacaError = err.responseJSON.todos.errors.map(el=>el.message).join(",")     
        toastr["error"](bacaError, "Messages ")

    })
   
}




$('.addtodoform').click(function () {
    $('.createForm').show()
    $('#todocontent').hide()
    $('.editForm').hide()
})
$('.view_done').click(function () {
    
    $('.createForm').hide()
    $('.editForm').hide()
    viewtodo_done()    
    toastr["info"]("Todo list Done", "Message")
    
})
$('.view_undone').click(function () {
    $('.createForm').hide()
    $('.editForm').hide()
    viewtodo();
    toastr["info"]("Todo list still on progress", "Message") 
})
$('.signout').click(function () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
   localStorage.clear()
   $('#email').val('') 
    $('#pass').val('') 
   authentication()
})
function updateStatus(id){
    $.ajax({
        method:"PUT",
        url:urlmaster + '/todos/' + id +'/status',
        headers:{
            token:localStorage.token
        },
        data:{
            status:"true"
        }
    })
    .done(result=>{
        toastr["success"]("Update Todo list success", "Message")
        authentication()
    })
    .fail(err=>{
        let bacaError = err.responseJSON.todos.errors.map(el=>el.message).join(",")   
        toastr["error"](bacaError, "Message")
    })

}
function del(id){
    $.ajax({
        method:"DELETE",
        url:urlmaster + '/todos/' + id,
        headers:{
            token:localStorage.token
        }
    })
    .done(result=>{
    
        authentication()
    })
    .fail(err=>{

    })

}
function update(event){

    let id = $('#editid').val()
    let title =  $('#edittitle').val()
    let description = $('#editdescription').val()
    let due_date = $('#editdue_date').val()  
    
    

    $.ajax({
        method:"PUT",
        url:urlmaster + '/todos/' + id ,
        headers:{
            token:localStorage.token
        },
        data:{
            title : title,
            description: description,
            status: "false",
            due_date : due_date
        }
    })
    .done(result=>{
    
    })
    .fail(err=>{

    })
    event.preventDefault;
}
function updateForm(id,title,description,due_date){
       console.log(id,title,description,due_date)
       
        $('.editForm').show()
        $('#editid').val(id)
        $('#edittitle').val(title)
        $('#editdescription').val(description)
        $('#editdue_date').val(due_date)



}
function show_signup_form(event){
    event.preventDefault()
    $('.limiter').hide()
    $('#registerForm').show()
}
function login_view(event){
    $('.limiter').show()
    $('#registerForm').hide()
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        method :'POST',
        url: urlmaster +'/user/gmail',
        data:{
            id_token
        }
    })
    .done(result=>{
        // $('.createForm').hide()
        // authentication()
        console.log(result);
        
        localStorage.setItem('token',result.Data.token)
        localStorage.setItem('email',result.Data.email)
        authentication()
           
    })
    .fail(err=>{
        console.log("errrooo",err)
    })
  }

  function forgotpassword(event){
      event.preventDefault()
      console.log($('#forgot_email').val());
      
    $.ajax({
        method:"GET",
        url:urlmaster + '/user/forgot/' + $('#forgot_email').val()       
    })
    .done(result=>{
    
        authentication()
    })
    .fail(err=>{

    })

}
function show_forgot_form(event){
    event.preventDefault()
    $('.limiter').hide()
    $('#forgotform').show()

}
