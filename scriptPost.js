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
        /*let alert=new bootstrap.Alert('#liveAlertPlaceholder')
        setTimeout(() => {
        alert.close()
    }, 2000);*/
  
    
    

}

////////////////////////////////////
//fonction pour afficher un poste
////////////////////////////////////
async function getPost(){
    let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${idpost}`)
    let posts = await response.json()
    let data=posts.data 
    let user = document.getElementById("user-name");
    user.innerHTML=`${data.author.username} Post`
    let postsAfiichage = document.getElementById("post")
        postsAfiichage.innerHTML=`
            <div class="card mt-3 shadow" id="${data.id}">
                <div class="card-header">
                <img src="${data.author.profile_image}" alt="imgProfile" id="imgProfile" class="rounded-circle">
                <p   id="nomProfile">@${data.author.username}</p>
                </div>
                <div class="card-body">
                <img src="${data.image}" alt="imgPost">
                <h6 id="subPhoto">${data.created_at}</h6>
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text">${data.body}</p>
                </div>
                <div class="card-footer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                    <span class="text-decoration-underline">
                        (${data.comments_count})comments
                        <span id="tags-content-${data.id}">
                            
                        </span>
                    </span>
                </div>
                <div id = "comment">
                    <div class="mb-3 commentclass" id="addcomment">
                        <label for="input_comment" class="col-form-label">add comment:</label>
                        <input type="text" class="d-inline " id="input_comment">
                        <button type="button" class="btn btn-dark d-inline" id="addcomment" onclick="setComment(${idpost})">Send</button>
                    </div>
                </div>
            </div>
                `
        let idTag = `tags-content-${data.id}`
        for(tag of data.tags){
        document.getElementById(idTag).innerHTML+=
        `
        <button type="button" class="btn btn-secondary m-3 btn-sm rounded-5">${tag.name}</button>
         `
        }
        for(comment of data.comments){
            document.getElementById("comment").innerHTML+=`
           <div class="commentclass">
            <img src="${comment.author.profile_image}" alt="" id="commentImag" class="rounded-4"><b>  ${comment.author.username}</b>
            <br>
            <p>${comment.body}</p>
           </div>    
            `
        }
        cacherCom()
    }

//////////////////////////////////////
//fonction pour ajouter un commentaire
//////////////////////////////////////
async function setComment(){
    let comment = document.getElementById("input_comment").value
    let data = {
        body : comment
    }
    let token = localStorage.getItem("token")
try{
    let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${idpost}/comments`,{
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "authorization": `Bearer ${token}`
              // Ajoutez d'autres en-têtes si nécessaire
        },
         body: JSON.stringify(data)
    })
    let result = await response.json()
    console.log(result)
    if(!response.ok){
        throw new Error(result.message)
    }
    
    getPost()
}catch(erreur){
    alertSuccessLogin(erreur,"danger")
}

}


////////////////////////
//appelle des fonctions
////////////////////////
let param = new URLSearchParams(window.location.search)
let idpost = param.get("idpost")
getPost()
