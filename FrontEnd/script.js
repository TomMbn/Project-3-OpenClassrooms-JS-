/*Initialisation des variables*/

let api = "http://localhost:5678/api/";
let urlWorks = api+"works";
let urlCategory = api+"categories";
let gallery = document.querySelector("#gallery");
let filter = document.querySelector("#filterList")
let edit = document.querySelectorAll(".edit");
let loginNav = document.querySelector("#login");
let galleryModal = document.querySelector("#galleryModal");
let addImageNoFile = document.querySelector("#addImageNoFile");
let imageNewProject = document.querySelector("#imageNewProject");
let addForm = document.querySelector("#add");
let addImage = addForm.querySelector("input[type=\"file\"]");
let addTitle = addForm.querySelector("input[type=\"text\"]");
let addCategory = addForm.querySelector("select");
let index = 0;
const categorySet = new Set();


/*Récupération des travaux via l'API*/

async function getWorks(){
    const request = await fetch(urlWorks, {
        method : "GET"
    });

    if(!request.ok){
        alert("Un problème est survenu.")
    }
    else{
        let donnees = await request.json();
        gallery.replaceChildren();
        galleryModal.replaceChildren();

        donnees.forEach(element => {
            addWorks(element);
            addWorksModal(element);
            index++;
        });
    }
}

/*Ajout des travaux au HTML*/

function addWorks(work){

    let image = work.imageUrl; 
    let nom = work.title;
    let category = work.category.name;

    let newFigure = document.createElement("figure");
    newFigure.className = category;
    
    let newImg = document.createElement("img");
    newImg.setAttribute("src", image);
    newImg.setAttribute("alt", nom);
    newImg.setAttribute("crossorigin","anonymous");

    let newFigcaption = document.createElement("figcaption");
    newFigcaption.textContent = nom;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigcaption);
    gallery.appendChild(newFigure);
}

function addWorksModal(work){
    let image = work.imageUrl; 
    let nom = work.title;
    let id = work.id;
    

    let newFigure = document.createElement("figure");
    
    let newDiv = document.createElement("div");
    newDiv.className = "editImage";

    if (index == 0){
        let moveIcon = document.createElement("i");
        moveIcon.className = "fa-solid fa-arrows-up-down-left-right";
        newDiv.appendChild(moveIcon);
    }

    let newIcon = document.createElement("i");
    newIcon.className = "fa-solid fa-trash";
    newIcon.setAttribute("id", id);

    newIcon.addEventListener("click", deleteProject);
    newDiv.appendChild(newIcon);
    
    let newImg = document.createElement("img");
    newImg.setAttribute("src", image);
    newImg.setAttribute("alt", nom);
    newImg.setAttribute("crossorigin","anonymous");
    newDiv.appendChild(newImg);

    let newFigcaption = document.createElement("figcaption");
    newFigcaption.textContent = "éditer";

    newFigure.appendChild(newDiv);
    newFigure.appendChild(newFigcaption);
    galleryModal.appendChild(newFigure);
}

/*Récupération des catégories via l'API*/

async function getCategory(){
    const request = await fetch(urlCategory, {
        method : "GET"
    });

    if (!request.ok){
        alert("Une erreur est survenue");
    }
    else{
        let donnees = await request.json();
        donnees.forEach(element =>{
            categorySet.add(element.name);
            addCategoryModal(element);
        })
        categorySet.forEach(element => {
        addFilter(element);
        });
    }
}

/*Création des filtres et ajout au HTML*/

function addFilter(category){
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "filter");
    newDiv.textContent = category;
    newDiv.addEventListener("click", eventFilter);
    document.querySelector("#filterList").appendChild(newDiv);
}

/*Fonction pour rendre les filtres fonctionnels*/

function eventFilter(){
    let galleryFigures = gallery.querySelectorAll("figure");
    let filterDiv = document.getElementsByClassName("filter");

    this.style.color = "white";
    this.style.backgroundColor = "#1D6154";

    for(filter of filterDiv){
        if(!(filter.textContent === this.textContent)){
            filter.style.color = "#1D6154";
            filter.style.backgroundColor = "#FEFEF6";
        }
    } 
    
    if (this.textContent === "Tous"){
        for(element of galleryFigures) {
                element.style.display = "block";
        }
    }
    else{ 
        for(element of galleryFigures) {
            element.className === this.textContent ? element.style.display = "block" : element.style.display = "none";
        }
    }
}

function addCategoryModal(category){
    let selectCategory = document.querySelector("#category");
    let newOption = document.createElement("option");

    newOption.setAttribute("value", category.id);
    newOption.textContent = category.name;

    selectCategory.appendChild(newOption);
}



/*Si connexion page d'accueil en mode édition*/

if (sessionStorage.getItem("token")){
    document.querySelector("#editHeader").style.display = "flex";
    document.querySelector("#introduction").style.marginBottom = "10px";
    document.querySelector("#headerPortfolio").style.marginBottom = "92px"
    filter.style.display = "none";
    loginNav.textContent = "logout";

    /*Si clique sur logout réinistialisation de la page et suppression du token*/ 

    loginNav.addEventListener("click", function(e){

        e.preventDefault();
        document.querySelector("#editHeader").style.display = "none";
        document.querySelector("#introduction").style.marginBottom = "50px";
        document.querySelector("#headerPortfolio").style.marginBottom = "0px";
        filter.style.display = "flex";
        loginNav.textContent = "login";
        sessionStorage.removeItem("token");

        /*Annule le prevent default*/

        loginNav.addEventListener("click", function() { 
            window.open("./login.html", "_self"); 
        });
        

        for (element of edit){
            element.style.display = "none";
        }

    })

    for (element of edit){
        element.style.display = "flex";
    }
}

/*Gestion de l'apparition et de la disparition de la fenêtre modale et retour en arrière*/

let modal = document.querySelector('#modal');
let addImageModal = document.querySelector("#addImageModal");
let mainModal = document.querySelector("#mainModal");
let errorMessageAdd = document.querySelector("#errorMessageAdd");

document.querySelector("#editGallery").addEventListener("click", function(){
    modal.classList.toggle("active");

})


/*Fermeture modale*/
/*Fonction fermeture modale*/

function closeModal(){
    modal.classList.remove("active");
    if (addImageModal.classList.contains("active")){
        backModal(); 
    }
    if(addImageNoFile.style.display == "none"){
        addImageNoFile.style.display = "flex";
        imageNewProject.style.display = "none";
        addImage.value = null;
    }
    addCategory.value = null;
    addTitle.value = null;
}
/*Clic sur la croix pour fermer la modale*/

document.querySelectorAll(".closeModal").forEach(element => element.addEventListener("click", closeModal))

/*Clic en dehors de la modale pour fermer la modale */

modal.addEventListener("click", function(e){
    if(e.target.closest(".modalContainer") == null) {
        closeModal();          
    }
});

/*Ouverture modale ajout projet*/

document.querySelector("#buttonAddImage").addEventListener("click",function(){
    mainModal.classList.remove("active");
    addImageModal.classList.toggle("active");
})

/*Retour en arrière vers la modale principale*/
/*Fonction retour en arrière*/

function backModal(){
    addImageModal.classList.remove("active");
    mainModal.classList.toggle("active");
    if(errorMessageAdd.style.display == "block"){
        errorMessageAdd.style.display = "none";
        addImageModal.style.paddingBottom = "55px";
    }
}

document.querySelector("#backModal").addEventListener("click", function(){
      backModal();
})

/*Fonction bouton submit modale ajout projet*/

document.querySelector("#submitProject").addEventListener("click", function(e){
    e.preventDefault();
    sendProject();
})

/*Fonction ajout d'un nouveau projet*/

async function sendProject(){
    if (!((addImage.value == "") || (addTitle.value == "") || (addCategory.value == ""))){
        let formData = new FormData();
        formData.append("image", addImage.files[0]);
        formData.append("title", addTitle.value);
        formData.append("category", addCategory.value);

        const request = await fetch(urlWorks, {
            method : "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            body: formData
        });
    
        if(!request.ok){
            alert("Un problème est survenu.");
        }
        else{
            console.log("OK projet ajouté !");
            getWorks();
            backModal();
        }
    }
    
    else{
        errorMessageAdd.style.display = "block";
        addImageModal.style.paddingBottom = "21px"; 

    }
}
/*Fonction suppression d'un projet*/

async function deleteProject(){
    let id = this.getAttribute("id");
    
    const request = await fetch(urlWorks + "/" + id, {
        method : "DELETE",
        headers : {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    });
    if(!request.ok){
        alert("Un problème est survenu.")
    }
    else{
        console.log("OK projet supprimé !");
        getWorks();
        
    }
}

document.querySelector("input[type=\"file\"]").addEventListener("change", function(){
    const file = document.querySelector("input[type=\"file\"]").files[0];
    if (file){
        imageNewProject.setAttribute("src", URL.createObjectURL(file));
        addImageNoFile.style.display = "none";
        imageNewProject.style.display = "flex";
    }
})

/*Appel des fonctions*/

getWorks();
addFilter("Tous");
getCategory();
