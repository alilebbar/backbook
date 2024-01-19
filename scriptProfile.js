//////////////////////////////////////////
//Afficher les information de l'utilsateur
/////////////////////////////////////////
async function infoUser() {
    try {
        let inf = document.getElementById("info");
       
        let email = ""; // Déclarez la variable email
        let button = ""

        let response = await fetch(`https://tarmeezacademy.com/api/v1/users/${userId}`);
        let responseJson = await response.json();
        let userIn = responseJson.data;
        email = userIn.email !== null ? userIn.email : ""; // Mettez à jour l'assignation de l'email
        if(responseUser==="false"){
            button =`
            <div class="col-2 d-flex flex-column justify-content-evenly">
            <div>
             <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modifier_modal">Modifier</button>
            </div>
            <div>
             <button class="btn btn-danger"  onclick="supprimerUser()">Supprimer</button>
            </div>
        </div>
            `
        }

        inf.innerHTML = `
            <div class="col-2">
                <img src=${userIn.profile_image} alt="profile" id="imgCardProfile">
            </div>
            <div class="col-4 d-flex flex-column justify-content-evenly">
                <div class="userProfilInfo">
                    ${userIn.name}
                </div>
                <div class="userProfilInfo">
                    ${userIn.username}
                </div>
                <div class="userProfilInfo">
                    ${email}
                </div>
            </div>
            <div class="col-4 d-flex flex-column justify-content-evenly">
                <div class="numberInfo">
                    <span>${userIn.posts_count}</span> Posts
                </div>
                <div class="numberInfo">
                    <span>${userIn.comments_count}</span> comment
                </div>
            </div>
            ${button}
           
        `;
    } catch (error) {
        console.error(error);
    }
}


async function modifierUser(){
    let username = document.getElementById("input_username_modifier").value;
    let name = document.getElementById("input_name_modifier").value;
    let password = document.getElementById("input-password-modifier").value;
    let phProfile = document.getElementById("input_img_modifier").files[0]
    let token = localStorage.getItem("token")
    let data = new FormData()
    data.append("username",username)
    data.append("name",name)
    data.append("password",password)
    data.append("image",phProfile)
    data.append("_method","put")
    try {
        let response = await fetch("https://tarmeezacademy.com/api/v1/updatePorfile", {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`,
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
        afterLogin("register_modal","Modification parfaitement réussi!")
    } catch (error) {
        alertSuccessLogin(error,"danger")
    }
}
function supprimerUser(){
   alert("Supprimer")
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

/////////////////////////////////////
//Afficher les post de l'utilsateur
/////////////////////////////////////
async function getPostsProfile() {
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`);
        let posts = await response.json();
        let data = posts.data;
        let postsAfiichage = document.getElementById("postsProfile")
        postsAfiichage.innerHTML = "";
        for (let post of data) {
                let btnUp = "";
                let btnDel = "";
                let user = getCurentUser();
                let isMyPost = user !== null && user.id === post.author.id;

                if (isMyPost) {
                    btnUp = `<button class="btn btn-outline-primary" style="float:right;" onclick="editModalPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`;
                    btnDel = `<button class="btn btn-outline-danger" style="float:right; margin-right:5px;" onclick="comfirmerDelete(${post.id},'${post.title}')">Delete</button>`;
                }

                let cardDiv = document.createElement("div");
                cardDiv.classList.add("card", "mt-3", "shadow", "clicker");
                cardDiv.id = post.id;
                cardDiv.innerHTML += `
                    <div class="card-header">
                        <img src="${post.author.profile_image}" alt="imgProfile" id="imgProfile" class="rounded-circle">
                        <p id="nomProfile">@${post.author.username}</p>
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
                            (${post.comments_count}) comments
                            <span id="tags-content-${post.id}"></span>
                        </span>
                    </div>
                `;

                let idTag = `tags-content-${post.id}`;
                let tagsContent = cardDiv.querySelector(`#${idTag}`);

                for (let tag of post.tags) {
                    let tagButton = document.createElement("button");
                    tagButton.type = "button";
                    tagButton.classList.add("btn", "btn-secondary", "m-3", "btn-sm", "rounded-5");
                    tagButton.innerText = tag.name;
                    tagsContent.appendChild(tagButton);
                }

                postsAfiichage.appendChild(cardDiv);
            }
        
    } catch (error) {
        console.error(error);
    }
}

//la déclaration des variable globale
/////////////////////////////////////
 const user = getCurentUser();
 let userId = user.id;
 let responseUser="false"

///////////////////////
//appelle des fonctions
///////////////////////
let param = new URLSearchParams(window.location.search)
responseUser = param.get("response")
if (responseUser==="true"){
    userId = param.get("idUser")
}else {
    responseUser="false"
}
setupUI()
infoUser()
getPostsProfile()





