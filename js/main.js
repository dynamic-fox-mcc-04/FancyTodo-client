let urlmaster ='http://localhost:3000'
// $("#login").submit(function(event){
//     // mengambil value dari html    
//     login(event)
// })
$(document).ready(function(event){
    $('.createForm').hide()
    $('.editForm').hide()
    authentication()
   
    event.preventDefault;
})


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
        alert(err.responseJSON.msg)
        
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
            token:localStorage.token
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
            
            

         $('.row').append (`
         <div class="col-md-4 card-container">
         <div class="card-flip">
           <!-- Card 1 Front -->
           <div class="card front">
             <span class="fa fa-4x fa-smile-o text-center"></span>
             <div class="card-block">
               <h4 class="card-title text-center">${title}</h4>
               <h6 class="card-subtitle mb-2 text-muted text-center">${id}</h6>
               <p class="card-text">${description}</p>
             </div>
           </div>
           <!-- End Card 1 Front -->
   
           <!-- Card 1 Back -->
           <div class="card back">
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
           
    })
    .fail(err=>{
        console.log(err)
    })
    event.preventDefault()
}

$('.addtodoform').click(function () {
    $('.createForm').show()
    $('#todocontent').hide()
    $('.editForm').hide()
})

$('.editform').click(function () {
    $('.createForm').hide()
    $('#todocontent').hide()
    $('.editForm').show()
})

$('.signout').click(function () {
    
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
        alert('berhasil di update')
        authentication()
    })
    .fail(err=>{

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
        alert('berhasil didelete')
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
        alert('berhasil di update')
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