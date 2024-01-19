////////////////////////////////////
//fonction pour afficher les postes
////////////////////////////////////
async function getPosts(){
    loader(true)
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
        let posts = await response.json()
        let data=posts.data 
        lastPage = posts.meta.last_page
    
    
    let postsAfiichage = document.getElementById("posts")
 if(postsAfiichage){
    if(page===1)postsAfiichage.innerHTML=""
    for(let post of data){
        let btnUp=``
        let btnDel=``
        let user=getCurentUser()
        let isMyPost = user!==null && user.id === post.author.id
        if(isMyPost){
        btnUp=`<button class="btn btn-outline-primary" style="float:right;" onclick="editModalPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
        btnDel=`<button class="btn btn-outline-danger " style="float:right; margin-right:5px;" onclick="comfirmerDelete(${post.id},'${post.title}')">Delete</button>`

    }  
        postsAfiichage.innerHTML+=`
    <div class="card mt-3 shadow clicker" id="${post.id}" >
        <div class="card-header">
          <div onclick="profileUsers(${post.author.id})">
            <img src="${post.author.profile_image}" alt="imgProfile" id="imgProfile" class="rounded-circle">
            <p id="nomProfile">@${post.author.username}</p>
          </div>
          ${btnUp}
          ${btnDel}
          <input type="hidden" id="hidden-id" value="">
        </div>
        <div class="card-body" onclick="getId(${post.id})">
          <img src="${post.image}" alt="imgPost">
          <h6 id="subPhoto">${post.created_at}</h6>
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
        </div>
        <div class="card-footer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
            <span class="text-decoration-underline">
              (${post.comments_count})comments
              <span id="tags-content-${post.id}">
                
              </span>
            </span>
        </div>
    </div>
        `
        let idTag = `tags-content-${post.id}`
        for(tag of post.tags){
        document.getElementById(idTag).innerHTML+=
        `
        <button type="button" class="btn btn-secondary m-3 btn-sm rounded-5">${tag.name}</button>
         `
        }
      
    }
    
} 
} catch (error) {
    alertSuccessLogin(error,"danger")
} finally{
    loader(false)
}
}


/////////////////////////////////////////////////////
// fonction pour cree un nouveau post ou le modifier
////////////////////////////////////////////////////
async function creatoreditPost() {
    let title = document.getElementById("post-input_title").value;
    let body = document.getElementById("post-input_text").value;
    let image = document.getElementById("post-input_img").files[0]
    let token = localStorage.getItem("token")
    let choix = document.getElementById("hidden-id").value
    let url=""
    const dataForm = new FormData()
    dataForm.append("body", body)
    dataForm.append("title", title)
    dataForm.append("image", image)
    let message
    if(choix===null || choix ==="")
    {
     url="https://tarmeezacademy.com/api/v1/posts"
     message="Création de post parfaitement réussie!"
    }
    else{
      url=`https://tarmeezacademy.com/api/v1/posts/${choix}`  
      dataForm.append("_method","put")
      message="Modification de post parfaitement réussie!"
    }
    try {
        loader(true)
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: dataForm
        });
        let responseData = await response.json();
        if(!response.ok)
        {
            throw new Error(responseData.message)
        }
        afterLogin("post_modal", message);
    } catch (error) {
        alertSuccessLogin(error,"danger")
    }finally{
        loader(false)
    }
        
        
        
    
}
////////////////////////////////////////////////////////////////
//Adapter l'affichage de la meme popup pour modifier un post 
/////////////////////////////////////////////////////////////
function editModalPost(postObject)
{

 document.getElementById("modal_title").innerHTML=`Update Post`
 let modal = new bootstrap.Modal(document.getElementById("post_modal"),{})
 modal.toggle()
 let post=JSON.parse(decodeURIComponent(postObject)) 
 document.getElementById("hidden-id").value=post.id
 document.getElementById("post-input_title").value=post.title
 document.getElementById("post-input_text").value=post.body
 document.getElementById("PublierBTN").innerHTML=`Modifier`
}
////////////////////////////////////////////////////////
//Adapter l'affichage de la meme popup pour cree un post
////////////////////////////////////////////////////////
function creatModalPost(){
 document.getElementById("modal_title").innerHTML=`Creat Post`
 let modal = new bootstrap.Modal(document.getElementById("post_modal"),{})
 modal.toggle()
 document.getElementById("hidden-id").value=""
 document.getElementById("post-input_title").value=""
 document.getElementById("post-input_text").value=""
 document.getElementById("PublierBTN").innerHTML=`Publier`
}
///////////////////////////////////////////////////////
//Adapter l'affichage de la confirmation pour supprimer
///////////////////////////////////////////////////////
function comfirmerDelete(idpost,title){
    let modal = new bootstrap.Modal(document.getElementById("delete_modal"),{})
    document.getElementById("post-delete-title").innerText=title
    document.getElementById("deleteBtn").addEventListener("click",()=>{
        deletPost(idpost)
    })
    
    modal.toggle()
    
   }
///////////////////////////////////
// fonction pour supprimer un post
//////////////////////////////////
async function deletPost(idPost){
    let token = localStorage.getItem("token")
    let message = "la suppression est bien passer"
    try {
        loader(true)
        let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${idPost}`, {
            method: "DELETE",
            headers: {
                "authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        let responseData = await response.json();
        afterLogin("delete_modal",message)
        if(!response.ok)
        {
            throw new Error(responseData.message)
        }
    } catch (error) {
        alertSuccessLogin(error,"danger")
    }finally{
        loader(false)
    }
}
//////////////////////////////////////////
//prendre des imformation de local storage 
//////////////////////////////////////////
function getCurentUser(){
    let user = null 
    let storageUser = localStorage.getItem("user")
    if(storageUser)
    {
        user = JSON.parse(storageUser)
    }
    return user
}

////////////////////////////
//fonction pour faire login
///////////////////////////
async function login() {
    let username = document.getElementById("input_username_login").value;
    let password = document.getElementById("input-password-login").value;
    let data = {
        username: username,
        password: password
    };

    try {
        loader(true)
        let response = await fetch("https://tarmeezacademy.com/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
                // Ajoutez d'autres en-têtes si nécessaire
            },
            body: JSON.stringify(data),
        });

        let responseData = await response.json();
        if(!response.ok)
        {
            throw new Error(responseData.message)
        }
        localStorage.setItem("token", responseData.token)
        localStorage.setItem("user",JSON.stringify(responseData.user))
        afterLogin("login_modal","Login parfaitement réussi!")
    } catch (error) {
        alertSuccessLogin(error,"danger")
    }finally{
        loader(false)
    }
}

//////////////////////////////
//fonction pour faire register
//////////////////////////////
async function register() {
    let username = document.getElementById("input_username_register").value;
    let name = document.getElementById("input_name_register").value;
    let password = document.getElementById("input-password-register").value;
    let phProfile = document.getElementById("input_img_register").files[0]
    let data = new FormData()
    data.append("username",username)
    data.append("name",name)
    data.append("password",password)
    data.append("image",phProfile)

    try {
        loader(true)
        let response = await fetch("https://tarmeezacademy.com/api/v1/register", {
            method: "POST",
            headers: {
                "Accept": "application/json"
                // Ajoutez d'autres en-têtes si nécessaire
            },
            body:data
        });
        let responseData = await response.json();
        if(!response.ok)
        {
            throw new Error(responseData.message)
        }
        
        localStorage.setItem("token", responseData.token)
        localStorage.setItem("user",JSON.stringify(responseData.user))
        afterLogin("register_modal","register parfaitement réussi!")
    } catch (error) {
        alertSuccessLogin(error,"danger")
    }finally{
        loader(false)
    }
}
//////////////////////////
// fonction pour le logout
//////////////////////////
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    alertSuccessLogin("Logout parfaitement réussi!","success")
    setupUI()
    cacherCom()
    getPosts()
    
}


/////////////////////////////////////////////////////////////////////////////////////
// fonction pour changer l'affichage apres la reussite de login et register et logout
/////////////////////////////////////////////////////////////////////////////////////
function afterLogin(modal,message){
    let Modal = document.getElementById(modal)
    let instancModal = bootstrap.Modal.getInstance(Modal)
    instancModal.hide()
    setupUI()
    cacherCom()
    alertSuccessLogin(message,"success")
    getPosts()
    infoUser()
    getPostsProfile()
}

////////////////////////////////////////////////////////////////////////
//fonction pour afficher une alert signiphie que la fonction est ruissie
////////////////////////////////////////////////////////////////////////
function alertSuccessLogin(message,type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div id="messageRL">${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
        appendAlert(message, type)
        let alert=new bootstrap.Alert('#liveAlertPlaceholder div')
        setTimeout(() => {
        alert.close()
    }, 1000);
  
    
    

}

/////////////////////////////////////////////////////
//fonction qui fait le setUP pour l'affichage du site
/////////////////////////////////////////////////////
function setupUI(){
    let token = localStorage.getItem("token")
    let divlogout =  document.getElementById("divbtnlogout")
    let divlogregi = document.getElementById("divBtnNav")
    let usernamenav = document.getElementById("usernameLogout")
    let imgProfile= document.getElementById("imgProfile")
    let addPost = document.getElementById("btnplus")
    if (token !== null)
    {
        if(addPost){
            addPost.style.setProperty("display","block","important")
        }
        divlogout.style.setProperty("display","block","important")
        divlogregi.style.setProperty("display","none","important")
        let userlist = JSON.parse(localStorage.getItem("user"))
        usernamenav.innerHTML=`@${userlist.username}`
        if(userlist.profile_image && typeof userlist.profile_image === "string")
        {
            imgProfile.src=userlist.profile_image
        }else{
            imgProfile.src="/image_poste/profile.jpg"
        }
    

    }else{
        if(addPost){
            addPost.style.setProperty("display","none","important")
        }
        
        divlogout.style.setProperty("display","none","important")
        divlogregi.style.setProperty("display","flex","important")
    }
    
}

/////////////////////////////////////////////
//afficher ou cacher l'ajoute des commentaire
/////////////////////////////////////////////
function cacherCom(){
    let token = localStorage.getItem("token")
    let commentDiv = document.getElementById("addcomment")
    if(commentDiv!==null){
    if(token!==null){
       commentDiv.style.setProperty("display","block","important")
    }else{
        commentDiv.style.setProperty("display","none","important")
    }
    }

}

////////////////////////////////////
//fonction pour changer le location
////////////////////////////////////
function getId(idpost){
    window.location = `post.htm?idpost=${idpost}`
    
}

////////////////////////////////////////////////////////
//fonction pour changer le location vers la page profile
////////////////////////////////////////////////////////
function profileUsers(idUser){
    window.location = `profile.htm?idUser=${idUser}&response=true`
    
}

function loader(show = true){
    if(show){
        document.getElementById("loadingID").style.visibility = "visible"
    }else{
        document.getElementById("loadingID").style.visibility = "hidden"
    }
}
/////////////////////////////////////
//la déclaration des variable globale
/////////////////////////////////////
let page=1
let lastPage=0

///////////////////////
//appelle des fonctions
///////////////////////
getPosts()
setupUI()

//////////////
//le scrolling
//////////////
window.addEventListener("scroll",()=>{
    let endOfpage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight
    if(endOfpage && page<=lastPage){
        getPosts(++page)
    }
})










