let api = "http://localhost:5678/api/";
let urlWorks = api+"works";
let urlCategory = api+"categories";
let gallery = document.querySelector("#gallery");
let filter = document.querySelector("#filterList")
let edit = document.querySelectorAll(".edit");
let loginNav = document.querySelector("#login");
let galleryModal = document.querySelector("#galleryModal");
const categorySet = new Set();

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
        })
        categorySet.forEach(element => {
        addFilter(element);
        addCategoryModal(element);
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

    newOption.setAttribute("value", category);
    newOption.textContent = category;

    selectCategory.appendChild(newOption);
}

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
        
        donnees.forEach(element => {
            addWorks(element);
            addWorksModal(element);
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

    let newFigure = document.createElement("figure");
    newFigure.className = "modalIn"

    let newImg = document.createElement("img");
    newImg.className = "modalIn";
    newImg.setAttribute("src", image);
    newImg.setAttribute("alt", nom);
    newImg.setAttribute("crossorigin","anonymous");

    let newFigcaption = document.createElement("figcaption");
    newFigcaption.className = "modalIn"
    newFigcaption.textContent = "éditer";

    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigcaption);
    galleryModal.appendChild(newFigure);
}

/*Si connexion page d'accueil en mode*/
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

/*Gestion de l'apparition et de la disparition de la fenêtre modale*/
edit.forEach(element => element.addEventListener("click", function(){
    document.querySelector(".modal").classList.toggle("active");

}))

document.querySelectorAll(".closeModal").forEach(element => element.addEventListener("click", function(){
    document.querySelector(".modal").classList.remove("active");
    if (addImageModal.classList.contains("active")){
        addImageModal.classList.remove("active");
        document.querySelector("#mainModal").classList.toggle("active");
    }     
}))

let modalList = document.getElementsByClassName('modal')
let addImageModal = document.querySelector("#addImageModal");

for (modal of modalList){    
    modal.addEventListener("click", function(e){
        if(e.target.closest(".modalContainer") == null) {
            modal.classList.remove("active");
            if (addImageModal.classList.contains("active")){
                addImageModal.classList.remove("active");
                document.querySelector("#mainModal").classList.toggle("active");
            }          
        }
    })
};

document.querySelector("#buttonAddImage").addEventListener("click",function(){
    document.querySelector("#mainModal").classList.remove("active");
    document.querySelector("#addImageModal").classList.toggle("active");
})

document.querySelector("#backModal").addEventListener("click", function(){
    addImageModal.classList.remove("active");
    document.querySelector("#mainModal").classList.toggle("active");
})

/*Appel des fonctions*/
getWorks();
addFilter("Tous");
getCategory();
